import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function Navbar({ user, onLoginClick, onSignupClick, onLogoutClick }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const sync = () => {
      try {
        const raw = localStorage.getItem('admin_session');
        setIsAdmin(!!raw);
      } catch {
        setIsAdmin(false);
      }
    };
    sync();
    const onChange = () => sync();
    window.addEventListener('admin_session_changed', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('admin_session_changed', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [user]);

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div className="logo" onClick={() => navigate('/')}>SmartBus</div>
        <nav className="nav-actions">
          {isAdmin && (
            <button type="button" className="nav-link" onClick={() => navigate('/admin-dashboard')}>
              Admin Portal
            </button>
          )}
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
