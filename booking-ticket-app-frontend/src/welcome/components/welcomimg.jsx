import { useState } from "react";
import Authentication from "./Authentication";

function Welcoming() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);

  if (currentUser)
    return <h2 className="welcome-user">Welcome, {currentUser.username || currentUser.email}</h2>;

  return (
    <div className="welcome-container">
      {!authMode && (
        <>
          <div className="welcome-header">
            <h1 className="welcome-title">WELCOME TO SMART BUS TICKET BOOKING</h1>
            <p className="welcome-slogan">
              Book your bus tickets in seconds, track your rides in real-time, and never miss a journey again.
            </p>
          </div>

          <div className="welcome-steps">
            <h2>Get Started in 3 Simple Steps</h2>
            <ol>
              <li><strong>Sign Up / Login:</strong> Create an account or log in to start.</li>
              <li><strong>Select Your Bus:</strong> Choose your route and seat.</li>
              <li><strong>Track & Ride:</strong> Pay securely and track your bus in real-time.</li>
            </ol>
          </div>

          <div className="welcome-buttons">
            <button onClick={() => setAuthMode("signin")} className="btn primary">
              Login
            </button>
            <button onClick={() => setAuthMode("signup")} className="btn primary">
              Signup
            </button>
          </div>
        </>
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
