import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Gallery from './Gallery';
import Authentication from '../welcome/components/Authentication';
import './LandingPage.css';
import './Modal.css';
import { supabase } from '../lib/supabaseClient';

function LandingPage() {
  const [authMode, setAuthMode] = useState(null); // 'signin' | 'signup' | null
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState('');
  
  // Effect to handle modal state changes
  useEffect(() => {
    console.log('authMode changed to:', authMode);
    
    // Toggle body class when modal is open/closed
    if (authMode) {
      document.body.classList.add('modal-open');
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'auto';
    };
  }, [authMode]);

  // Debug click handler
  const handleLoginClick = () => {
    console.log('Login button clicked');
    setAuthMode('signin');
  };
  
  const handleSignupClick = () => {
    console.log('Signup button clicked');
    setAuthMode('signup');
  };

  const closeModal = () => setAuthMode(null);

  // Auto-dismiss toast after 10 seconds
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 10000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) setUser(data.session?.user || null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    try { localStorage.removeItem('admin_session'); } catch {}
  };

  return (
    <div className="landing-page">
      <Navbar 
        user={user}
        onLoginClick={handleLoginClick} 
        onSignupClick={handleSignupClick}
        onLogoutClick={handleLogout}
      />
      <main>
        <Hero 
          user={user}
          onRequireAuth={(mode) => setAuthMode(mode || 'signin')}
          onNotify={(msg) => setNotice(msg)}
        />
        <Gallery />
      </main>

      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          <button className="toast-close" onClick={() => setNotice('')} aria-label="Dismiss">×</button>
        </div>
      )}

      {authMode && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rrgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={closeModal}
        >
          <div 
            style={{
              padding: '2rem',
              width: '100%',
              maxWidth: '400px',
              position: 'relative',
              zIndex: 10000,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
              onClick={closeModal}
              aria-label="Close modal"
            >
              ×
            </button>
            <div>
              <h2 style={{ marginTop: 0 }}>{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
              <div style={{ padding: '20px' }}>
                <p>Debug: authMode = {authMode}</p>
                <Authentication 
                  mode={authMode}
                  onAuthSuccess={() => {
                    console.log('Auth success!');
                    setAuthMode(null);
                    setNotice('Authentication successful!');
                  }}
                  onNotify={(msg) => {
                    console.log('Auth notification:', msg);
                    setNotice(msg);
                  }}
                  onBack={() => {
                    console.log('Back button clicked');
                    closeModal();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
