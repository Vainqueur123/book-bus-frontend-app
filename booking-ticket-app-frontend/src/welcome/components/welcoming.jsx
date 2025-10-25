import { useState } from 'react';
import Authentication from './Authentication';

function Welcoming() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);

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
          onBack={() => setAuthMode(null)}
        />
      )}
    </div>
  );
}

export default Welcoming;
