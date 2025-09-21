import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";

import BusList from "../components/BusList";
import SeatSelector from "../components/SeatSelector";
import BookingSummary from "../components/BookingSummary";
import LiveMap from "../components/LiveMap";

function BookingPage({ user }) {
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const username = useMemo(() => {
    if (!user || typeof user !== "object") return "Guest";
    return user.username || user.email || "Guest";
  }, [user]);

  const handleBusSelect = useCallback((bus) => {
    setSelectedBus(bus || null);
    setSelectedSeats([]);
    setBookingConfirmed(false);
    setShowMap(false);
  }, []);

  const handleSeatChange = useCallback((nextSeats) => {
    const unique = Array.isArray(nextSeats)
      ? [...new Set(nextSeats)]
      : [];
    setSelectedSeats(unique);
  }, []);

  const handleBookingConfirm = useCallback(() => {
    if (!selectedBus) return;
    if (!selectedSeats.length) return;
    setBookingConfirmed(true);
    setShowMap(true);
  }, [selectedBus, selectedSeats.length]);

  const handleBackToBuses = useCallback(() => {
    setSelectedBus(null);
    setSelectedSeats([]);
    setBookingConfirmed(false);
    setShowMap(false);
  }, []);

  return (
    <div className="booking-page">
      <h1 className="booking-title">Welcome, {username}</h1>

      {!selectedBus && (
        <BusList onBusSelect={handleBusSelect} />
      )}

      {selectedBus && !showMap && (
        <div className="booking-grid">
          <div className="seat-selector-wrapper">
            <SeatSelector
              bus={selectedBus}
              selectedSeats={selectedSeats}
              onSeatChange={handleSeatChange}
            />
          </div>

          <div className="booking-summary-wrapper">
            <BookingSummary
              bus={selectedBus}
              seats={selectedSeats}
              onConfirm={handleBookingConfirm}
              confirmDisabled={!selectedSeats.length}
              confirmed={bookingConfirmed}
            />

            <button
              type="button"
              onClick={handleBackToBuses}
              className="btn secondary"
            >
              ← Choose a different bus
            </button>
          </div>
        </div>
      )}

      {showMap && selectedBus && (
        <div className="map-section">
          <LiveMap bus={selectedBus} seats={selectedSeats} />
          <div className="map-buttons">
            <button
              type="button"
              onClick={() => setShowMap(false)}
              className="btn secondary"
            >
              ← Edit seats
            </button>
            <button
              type="button"
              onClick={handleBackToBuses}
              className="btn secondary"
            >
              Choose a different bus
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

BookingPage.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
  }),
};

BookingPage.defaultProps = {
  user: { username: "Guest" },
};

export default BookingPage;
