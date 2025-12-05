import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Authentication from './Authentication';

function Welcoming() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Sync auth mode with URL query (?mode=login|signup)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'login') setAuthMode('signin');
    if (mode === 'signup') setAuthMode('signup');
  }, [location.search]);

  if (currentUser)
    return (
      <h2 className="welcome-user">
        Welcome, {currentUser.username || currentUser.email}
      </h2>
    );

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">WELCOME TO SMART BUS TICKET BOOKING</h1>

      {!authMode && (
        <div className="welcome-buttons">
          <button onClick={() => setAuthMode('signin')} className="btn primary">
            Login
          </button>
          <button onClick={() => setAuthMode('signup')} className="btn primary">
            Signup
          </button>
        </div>
      )}

      {authMode && (
        <Authentication
          mode={authMode}
          onAuthSuccess={(user) => setCurrentUser(user)}
          onBack={() => {
            setAuthMode(null);
            // Clear query param to allow showing the buttons again
            const url = new URL(window.location.href);
            url.searchParams.delete('mode');
            navigate(url.pathname, { replace: true });
          }}
        />
      )}
    </div>
  );
}

export default Welcoming;
