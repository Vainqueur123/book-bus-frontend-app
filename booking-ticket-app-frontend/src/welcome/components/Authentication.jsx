 import { useState, useEffect } from "react";

function Authentication({ mode: initialMode, onAuthSuccess, onBack }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (mode === "signup") {
      if (!form.username) return "Username required";
      if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email";
      if (form.password.length < 6) return "Password too short";
      if (form.password !== form.confirm) return "Passwords do not match";
    }
    if (mode === "signin") {
      if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email";
      if (!form.password) return "Password required";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) return setError(err);

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) onAuthSuccess(data.user);
      else setError(data.message || "Auth failed");
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        {mode === "signup" && (
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

        {mode === "signup" && (
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

        <button type="submit" disabled={loading} className="auth-button primary">
          {loading ? "Processing..." : mode === "signin" ? "Login" : "Signup"}
        </button>

        <button type="button" onClick={onBack} className="auth-button secondary">
          Back
        </button>

        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
}

export default Authentication;
