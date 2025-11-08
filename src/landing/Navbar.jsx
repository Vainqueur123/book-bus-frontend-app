import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';

function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div className="logo" onClick={() => navigate('/')}>SmartBus</div>
        <nav className="nav-actions">
          <Link className="nav-link" to="/auth?mode=login">Login</Link>
          <Link className="btn btn-cta" to="/auth?mode=signup">Sign up</Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
