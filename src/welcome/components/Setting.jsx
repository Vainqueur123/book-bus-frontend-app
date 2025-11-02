import { useState } from 'react';

function Settings() {
  const [username, setUsername] = useState('User123');
  const [email, setEmail] = useState('user@example.com');
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
  });

  const handleThemeChange = (e) => setTheme(e.target.value);
  const handleNotificationChange = (e) =>
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-section">
        <h2 className="settings-section-title">Account</h2>
        <label className="settings-label">Username</label>
        <input
          type="text"
          className="settings-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="settings-label">Email</label>
        <input
          type="email"
          className="settings-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="settings-button">Update Account</button>
      </div>

      <div className="settings-section">
        <h2 className="settings-section-title">Theme</h2>
        <select
          className="settings-select"
          value={theme}
          onChange={handleThemeChange}
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="blue">Blue</option>
        </select>
      </div>

      <div className="settings-section">
        <h2 className="settings-section-title">Notifications</h2>
        <label className="settings-checkbox">
          <input
            type="checkbox"
            name="email"
            checked={notifications.email}
            onChange={handleNotificationChange}
          />
          Email Notifications
        </label>
        <label className="settings-checkbox">
          <input
            type="checkbox"
            name="sms"
            checked={notifications.sms}
            onChange={handleNotificationChange}
          />
          SMS Notifications
        </label>
      </div>

      <div className="settings-section">
        <button className="settings-button logout-button">Logout</button>
      </div>
    </div>
  );
}

export default Settings;
