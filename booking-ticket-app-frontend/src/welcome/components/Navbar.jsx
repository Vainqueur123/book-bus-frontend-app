import { useState } from "react";
import { FaBell, FaCog, FaHome } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import PropTypes from "prop-types";
import Authentication from "./Authentication";
import { useNavigate } from "react-router-dom";

// 1. Define Mock Notifications Data for Frontend Testing
const mockNotifications = [
  {
    busName: "Horizon Express",
    route: "Kigali to Rubavu",
    time: "10:00 AM",
    seats: ["A1", "A2"],
    paymentMethod: "MomoPay",
    amount: "5000",
    qrToken: "MOCK-QR-001", // Mock token for QR code display
  },
  {
    busName: "Local Transit",
    route: "City Center Loop",
    time: "08:30 AM",
    seats: ["B4"],
    paymentMethod: "Visa Card",
    amount: "500",
    qrToken: "MOCK-QR-002",
  },
];

function Navbar({ user, notifications, onLogout, onSettingsClick }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(user);

  const toggleNotifications = () => {
    // Allows any user (logged in or guest) to click and open the panel
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

  // 2. Logic to determine which data to use for rendering
  // If currentUser exists, use the real notifications prop.
  // If not, use the mock data to show the design.
  const dataToDisplay = currentUser ? notifications : mockNotifications;
  const showBadge = currentUser && notifications.length > 0;

  // Helper function to render the notification content
  const renderNotificationDropdownContent = () => {
    if (dataToDisplay.length === 0) {
      return <p>No notifications available.</p>;
    }

    return dataToDisplay.map((notif, idx) => (
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
        <p>Digital Ticket: </p>
        {/* The QR code is now generated for both real and mock data */}
        <QRCodeCanvas value={notif.qrToken} size={80} />
      </div>
    ));
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
          {/* HOME BUTTON: Visible to all users */}
          <button className="btn navbar-home" onClick={handleHomeClick}>
            <FaHome /> Home
          </button>

          {/* NOTIFICATION BELL ICON: Visible to all users */}
          <div className="navbar-icon-wrapper">
            <button className="btn navbar-icon" onClick={toggleNotifications}>
              <FaBell />
              {/* Notification badge only shows if logic indicates a need (mock data will not show a badge unless you change the 'showBadge' logic) */}
              {showBadge && (
                <span className="notification-count">{notifications.length}</span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN PANEL: Always appears if 'showNotifications' is true */}
            {showNotifications && (
              <div className="notification-dropdown">
                {renderNotificationDropdownContent()}
              </div>
            )}
          </div>

          {/* ICON GROUP (SETTINGS & LOGOUT): Only visible to logged-in users */}
          {currentUser && (
            <div className="navbar-icons">
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