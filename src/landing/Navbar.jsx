import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function Navbar({ user, onLoginClick, onSignupClick, onLogoutClick }) {
  const navigate = useNavigate();
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div className="logo" onClick={() => navigate('/')}>SmartBus</div>
        <nav className="nav-actions">
          {user ? (
            <button type="button" className="btn" onClick={onLogoutClick}>Logout</button>
          ) : (
            <>
              <button type="button" className="nav-link" onClick={onLoginClick}>Login</button>
              <button type="button" className="btn btn-cta" onClick={onSignupClick}>Sign up</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
