import { Routes, Route } from 'react-router-dom';
import BookingPage from './welcome/components/BookingPage';
import Settings from './welcome/components/Setting';
import Welcoming from './welcome/components/welcoming';
import BookingConfirm from './welcome/components/BookingConfirm';
import LandingPage from './landing/LandingPage';
import Layout from './layout/Layout';
import AdminDashboard from './admin/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Welcoming />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/seats" element={<BookingConfirm />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
