import { useCallback, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";

import BusList from "../components/BusList";
import SeatSelector from "../components/SeatSelector";
import LiveMap from "../components/LiveMap";

function BookingPage({ user }) {
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [step, setStep] = useState(1); // 1: bus, 2: seats, 3: payment, 4: review, 5: map

  const username = useMemo(() => {
    if (!user || typeof user !== "object") return "Guest";
    return user.username || user.email || "Guest";
  }, [user]);

  const handleBusSelect = useCallback((bus) => {
    setSelectedBus(bus || null);
    setSelectedSeats([]);
    setPaymentMethod("");
    setSelectedBank("");
    setStep(2);
  }, []);

  const handleSeatChange = useCallback((nextSeats) => {
    const unique = Array.isArray(nextSeats) ? [...new Set(nextSeats)] : [];
    setSelectedSeats(unique);
  }, []);

  useEffect(() => {
    if (selectedSeats.length > 0) {
      setStep(3);
    }
  }, [selectedSeats]);

  const handlePaymentSelect = useCallback((method) => {
    setPaymentMethod(method);
    if (method !== "Bank") setSelectedBank("");
  }, []);

  const handleProceedToReview = useCallback(() => {
    if (!paymentMethod) return;
    if (paymentMethod === "Bank" && !selectedBank) return;
    setStep(4);
  }, [paymentMethod, selectedBank]);

  const handleConfirmPayment = useCallback(() => {
    setStep(5);
  }, []);

  const handleBackToBuses = useCallback(() => {
    setSelectedBus(null);
    setSelectedSeats([]);
    setPaymentMethod("");
    setSelectedBank("");
    setStep(1);
  }, []);

  return (
    <div className="booking-page">
      <h1 className="booking-title">Welcome, {username}</h1>

      {step === 1 && <BusList onBusSelect={handleBusSelect} />}

      {step === 2 && selectedBus && (
        <div className="booking-grid">
          <div className="seat-selector-wrapper">
            <SeatSelector
              bus={selectedBus}
              selectedSeats={selectedSeats}
              onSeatChange={handleSeatChange}
            />
          </div>
          <div className="booking-summary-wrapper">
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

      {step === 3 && (
        <div className="payment-section">
          <h2>Select Payment Method</h2>
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="MTN"
              checked={paymentMethod === "MTN"}
              onChange={() => handlePaymentSelect("MTN")}
            />
            MTN
          </label>
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="Airtel"
              checked={paymentMethod === "Airtel"}
              onChange={() => handlePaymentSelect("Airtel")}
            />
            Airtel
          </label>
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="Bank"
              checked={paymentMethod === "Bank"}
              onChange={() => handlePaymentSelect("Bank")}
            />
            Bank
          </label>

          {paymentMethod === "Bank" && (
            <select
              className="bank-select"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
            >
              <option value="">Select a Bank</option>
              <option value="BK">Bank of Kigali</option>
              <option value="Equity">Equity Bank</option>
              <option value="I&M">I&M Bank</option>
              <option value="Cogebanque">Cogebanque</option>
              <option value="GTBank">GTBank</option>
            </select>
          )}

          <div className="payment-buttons">
            <button
              type="button"
              disabled={
                !paymentMethod || (paymentMethod === "Bank" && !selectedBank)
              }
              onClick={handleProceedToReview}
              className="btn primary"
            >
              Proceed payment
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn secondary"
            >
              ← Back to Seats
            </button>
          </div>
        </div>
      )}

      {step === 4 && selectedBus && (
        <div className="review-section">
          <h2>Booking Details</h2>
          <p>
            <strong>Bus:</strong> {selectedBus.name} ({selectedBus.route})
          </p>
          <p>
            <strong>Time:</strong> {selectedBus.time}
          </p>
          <p>
            <strong>Seats:</strong> {selectedSeats.join(", ")}
          </p>
          <p>
            <strong>Payment Method:</strong> {paymentMethod}{" "}
            {paymentMethod === "Bank" ? `- ${selectedBank}` : ""}
          </p>
          <p>
            <strong>Total Amount:</strong> {selectedSeats.length * 1000} RWF
          </p>

          <div className="review-buttons">
            <button
              type="button"
              onClick={handleConfirmPayment}
              className="btn primary"
            >
              Confirm Payment
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn secondary"
            >
              ← Back to Payment
            </button>
          </div>
        </div>
      )}

      {step === 5 && selectedBus && (
        <div className="map-section">
          <LiveMap bus={selectedBus} seats={selectedSeats} />
          <div className="map-buttons">
            <button
              type="button"
              onClick={handleBackToBuses}
              className="btn secondary"
            >
              Book Another Bus
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
