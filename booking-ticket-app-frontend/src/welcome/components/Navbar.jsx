import { useState } from "react";
import { FaBell, FaCog, FaHome } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import PropTypes from "prop-types";
import Authentication from "./Authentication";
import { useNavigate } from "react-router-dom";

function Navbar({ user, notifications, onLogout, onSettingsClick }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(user);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setAuthMode(null);
  };

  const handleBack = () => setAuthMode(null);

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left"></div>

        <div className="navbar-center">
          {currentUser ? (
            <span className="navbar-user">Hello, {currentUser.username || currentUser.email}</span>
          ) : (
            <div className="navbar-auth-buttons">
              <button className="btn primary" onClick={() => setAuthMode("signup")}>
                Get Started
              </button>
              <button className="btn primary" onClick={() => setAuthMode("signin")}>
                Sign In
              </button>
            </div>
          )}
        </div>

        <div className="navbar-right">
          <button className="btn navbar-home" onClick={handleHomeClick}>
            <FaHome /> Home
          </button>
          {currentUser && (
            <div className="navbar-icons">
              <div className="navbar-icon-wrapper">
                <button className="btn navbar-icon" onClick={toggleNotifications}>
                  <FaBell />
                  {notifications.length > 0 && (
                    <span className="notification-count">{notifications.length}</span>
                  )}
                </button>

                {showNotifications && (
                  <div className="notification-dropdown">
                    {notifications.length === 0 && <p>No notifications</p>}
                    {notifications.map((notif, idx) => (
                      <div key={idx} className="notification-item">
                        <p><strong>Bus:</strong> {notif.busName}</p>
                        <p><strong>Route:</strong> {notif.route}</p>
                        <p><strong>Time:</strong> {notif.time}</p>
                        <p><strong>Seats:</strong> {notif.seats.join(", ")}</p>
                        <p>
                          <strong>Payment:</strong> {notif.paymentMethod}
                          {notif.bank ? ` - ${notif.bank}` : ""}
                        </p>
                        <p><strong>Amount:</strong> {notif.amount} RWF</p>
                        <QRCodeCanvas value={notif.qrToken} size={80} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="btn navbar-icon" onClick={onSettingsClick}>
                <FaCog />
              </button>

              <button className="btn secondary" onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {authMode && (
        <Authentication
          mode={authMode}
          onAuthSuccess={handleAuthSuccess}
          onBack={handleBack}
        />
      )}
    </>
  );
}

Navbar.propTypes = {
  user: PropTypes.object,
  notifications: PropTypes.array,
  onLogout: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  notifications: [],
};

export default Navbar;