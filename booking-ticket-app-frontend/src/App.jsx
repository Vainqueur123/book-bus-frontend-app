import { Routes, Route } from "react-router-dom";
import BookingPage from "./welcome/components/BookingPage";
import Settings from "./welcome/components/Setting";
import Welcoming from "./welcome/components/welcoming";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcoming />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
