import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

function Authentication({ mode: initialMode, onAuthSuccess, onBack, onNotify }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (mode === 'signup') {
      if (!form.username) return 'Username required';
      if (!/\S+@\S+\.\S+/.test(form.email)) return 'Invalid email';
      if (form.password.length < 6) return 'Password too short';
      if (form.password !== form.confirm) return 'Passwords do not match';
    }
    if (mode === 'signin') {
      if (!/\S+@\S+\.\S+/.test(form.email)) return 'Invalid email';
      if (!form.password) return 'Password required';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) return setError(err);

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { username: form.username },
          },
        });
        if (error) throw error;
        // If email confirmation is enabled, data.session may be null
        if (onNotify) {
          onNotify('We sent a confirmation link to your email. Please verify to activate your account.');
        }
        onAuthSuccess(data.user);
        // After signup, optionally detect admin (email+password must match Admins table)
        try {
          const email = (form.email || '').trim();
          const pwd = form.password;
          let adminRes = await supabase
            .from('Admins')
            .select('*, companies(company_name)')
            .ilike('admin_email', email)
            .eq('password', pwd)
            .single();
          if (adminRes.error || !adminRes.data) {
            adminRes = await supabase
              .from('admins')
              .select('*, companies(company_name)')
              .ilike('admin_email', email)
              .eq('password', pwd)
              .single();
          }
          if (adminRes.data) {
            const adminData = {
              ...adminRes.data,
              companyName: adminRes.data?.companies?.company_name || null,
            };
            localStorage.setItem('admin_session', JSON.stringify(adminData));
            window.dispatchEvent(new Event('admin_session_changed'));
            if (onNotify) onNotify('Admin access enabled.');
          } else {
            localStorage.removeItem('admin_session');
            window.dispatchEvent(new Event('admin_session_changed'));
          }
        } catch (e) { if (onNotify) onNotify('Admin check failed. Please ensure access policies allow reading Admins.'); }
      } else {
        // Try normal Supabase auth first
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (!error) {
          onAuthSuccess(data.user);
          // Detect admin via Admins table (email + password)
          try {
            const email = (form.email || '').trim();
            const pwd = form.password;
            let adminRes = await supabase
              .from('Admins')
              .select('*, companies(company_name)')
              .ilike('admin_email', email)
              .eq('password', pwd)
              .single();
            if (adminRes.error || !adminRes.data) {
              adminRes = await supabase
                .from('admins')
                .select('*, companies(company_name)')
                .ilike('admin_email', email)
                .eq('password', pwd)
                .single();
            }
            if (adminRes.data) {
              const adminData = {
                ...adminRes.data,
                companyName: adminRes.data?.companies?.company_name || null,
              };
              localStorage.setItem('admin_session', JSON.stringify(adminData));
              window.dispatchEvent(new Event('admin_session_changed'));
            } else {
              localStorage.removeItem('admin_session');
              window.dispatchEvent(new Event('admin_session_changed'));
            }
          } catch (e) { if (onNotify) onNotify('Admin check failed. Please ensure access policies allow reading Admins.'); }
        } else {
          // Fallback: treat as Admin-only login using Admins table
          try {
            const email = (form.email || '').trim();
            const pwd = form.password;
            let adminRes = await supabase
              .from('Admins')
              .select('*, companies(company_name)')
              .ilike('admin_email', email)
              .eq('password', pwd)
              .single();
            if (!adminRes.error && adminRes.data) {
              const adminData = {
                ...adminRes.data,
                companyName: adminRes.data?.companies?.company_name || null,
              };
              localStorage.setItem('admin_session', JSON.stringify(adminData));
              window.dispatchEvent(new Event('admin_session_changed'));
              // Close modal as "logged in" for admin path
              onAuthSuccess(null);
              return;
            }
            // Also try lowercase table name if needed
            adminRes = await supabase
              .from('admins')
              .select('*, companies(company_name)')
              .ilike('admin_email', email)
              .eq('password', pwd)
              .single();
            if (!adminRes.error && adminRes.data) {
              const adminData = {
                ...adminRes.data,
                companyName: adminRes.data?.companies?.company_name || null,
              };
              localStorage.setItem('admin_session', JSON.stringify(adminData));
              window.dispatchEvent(new Event('admin_session_changed'));
              onAuthSuccess(null);
              return;
            }
            throw error;
          } catch (adminErr) {
            throw error; // preserve original auth error flow
          }
        }
      }
    } catch (ex) {
      // Helpful for diagnostics
      // eslint-disable-next-line no-console
      console.warn('Auth error from Supabase:', ex);
      const raw = (ex?.message || '').toString();
      const code = (ex?.code || '').toString();
      const status = ex?.status;
      const lower = raw.toLowerCase();
      const isDuplicateEmail = (
        code === 'user_already_exists' ||
        (status === 400 && (lower.includes('already') && (lower.includes('register') || lower.includes('exists')))) ||
        lower.includes('already registered') ||
        lower.includes('already exists') ||
        lower.includes('already in use') ||
        lower.includes('email address has already been registered') ||
        lower.includes('user already exists')
      );
      if (isDuplicateEmail) {
        const msg = 'This email is already in use. Try logging in instead.';
        setError(msg);
        if (onNotify) onNotify(msg);
      } else if (lower.includes('invalid login credentials')) {
        setError('Invalid email or password.');
      } else {
        setError(raw || 'Authentication error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <button
          type="button"
          className="auth-close"
          onClick={onBack}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="auth-title">
          {mode === 'signup' ? 'Create Account' : 'Log in to your account'}
        </h2>

        {mode === 'signup' && (
          <div className="form-group">
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>
        )}

        <div className="form-group">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </div>

        <div className="form-group">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </div>

        {mode === 'signup' && (
          <div className="form-group">
            <input
              name="confirm"
              type="password"
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="auth-button primary"
        >
          {loading ? 'Processing...' : mode === 'signin' ? 'Login' : 'Signup'}
        </button>

        {mode === 'signin' && (
          <button
            type="button"
            onClick={onBack}
            className="auth-button secondary"
          >
            Back
          </button>
        )}

        {mode === 'signin' ? (
          <p className="auth-switch">
            Don't have an account?
            <button
              type="button"
              className="auth-link"
              onClick={() => setMode('signup')}
            >
              Create account
            </button>
          </p>
        ) : (
          <p className="auth-switch">
            Already have an account?
            <button
              type="button"
              className="auth-link"
              onClick={() => setMode('signin')}
            >
              Log in
            </button>
          </p>
        )}

        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
}

export default Authentication;
