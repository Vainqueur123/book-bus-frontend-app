import { Routes, Route } from 'react-router-dom';
import BookingPage from './welcome/components/BookingPage';
import Settings from './welcome/components/Setting';
import Welcoming from './welcome/components/welcoming';
import BookingConfirm from './welcome/components/BookingConfirm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcoming />} />
      <Route path="/booking" element={<BookingPage />} />

      <Route path="/settings" element={<Settings />} />
      <Route path="/seats" element={<BookingConfirm />} />
    </Routes>
  );
}

export default App;
