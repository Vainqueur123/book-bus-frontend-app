import { Routes, Route } from 'react-router-dom';
import BookingPage from './welcome/components/BookingPage';
import Settings from './welcome/components/Setting';
import Welcoming from './welcome/components/welcoming';
import BookingConfirm from './welcome/components/BookingConfirm';
import LandingPage from './landing/LandingPage';
import Layout from './layout/Layout';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Welcoming />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/seats" element={<BookingConfirm />} />
      </Route>
    </Routes>
  );
}

export default App;
