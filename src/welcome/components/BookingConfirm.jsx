import React, { useState, useMemo, useCallback } from "react";
import "./BookingConfirm.css";

const TICKET_PRICE = 2000;
const BUS_CAPACITY = 30;

const bankOptions = ["BK (Bank of Kigali)", "BPR (Banque Populaire du Rwanda)", "Equity Bank", "Cogebanque"];
const paymentMethods = ["MTN Mobile Money", "Airtel Money", "Bank Transfer"];

const BusLayout = ({ capacity, selectedSeats, onSeatToggle }) => {
  const occupiedSeats = useMemo(() => new Set([5, 6, 15]), []);
  const totalSeats = Array.from({ length: capacity }, (_, i) => i + 1);

  const renderSeats = () => {
    const rowsCount = 3;
    const rowSize = Math.ceil(totalSeats.length / rowsCount);
    const rows = [];
    for (let i = 0; i < rowsCount; i++) {
      rows.push(totalSeats.slice(i * rowSize, (i + 1) * rowSize));
    }

    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="bus-row">
        {row.map((seatNumber) => {
          const isOccupied = occupiedSeats.has(seatNumber);
          const isSelected = selectedSeats.includes(seatNumber);
          let seatClass = "seat-tile";
          if (isOccupied) seatClass += " occupied";
          else if (isSelected) seatClass += " selected";

          return (
            <button
              key={seatNumber}
              className={seatClass}
              disabled={isOccupied}
              onClick={() => !isOccupied && onSeatToggle(seatNumber)}
            >
              {seatNumber}
            </button>
          );
        })}
      </div>
    ));
  };

  return <div className="bus-layout-container">{renderSeats()}</div>;
};

function BookingConfirm() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState({ name: "", number: "" });
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [ticketData, setTicketData] = useState(null);

  const numberOfSeats = selectedSeats.length;
  const totalFare = useMemo(
    () => (numberOfSeats * TICKET_PRICE).toLocaleString("en-RW", { style: "currency", currency: "RWF" }),
    [numberOfSeats]
  );

  const handleSeatToggle = useCallback((seatNumber) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) return prev.filter((s) => s !== seatNumber);
      if (prev.length < BUS_CAPACITY) return [...prev, seatNumber].sort((a, b) => a - b);
      return prev;
    });
  }, []);

  const handleConfirmPayment = () => {
    if (!passengerDetails.name.trim() || !passengerDetails.number.trim()) {
      alert("Please enter full passenger details.");
      return;
    }
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }
    if (selectedMethod === "Bank Transfer" && !selectedBank) {
      alert("Please select a bank for bank transfer.");
      return;
    }

    setPaymentStatus("processing");
    setTimeout(() => {
      const ticketRefs = selectedSeats.map(() => {
        return `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(
          65 + Math.floor(Math.random() * 26)
        )}${Math.floor(100 + Math.random() * 900)}`;
      });

      setTicketData({
        userName: passengerDetails.name,
        seats: selectedSeats,
        ticketRefs: ticketRefs,
      });

      setPaymentStatus("completed");
    }, 1500);
  };

  const renderPaymentContent = () => {
    if (paymentStatus === "completed" && ticketData) {
      return (
        <div className="payment-completed-section">
          <h2 className="section-title success">Payment Confirmed!</h2>
          {ticketData.seats.map((seat, idx) => (
            <div key={seat} className="ticket-id-box qualified">
              <div className="ticket-status-indicator">ACTIVE</div>
              <div className="ticket-id-display-area">
                <p>Seat: {seat}</p>
                <p>Ticket Reference: <b>{ticketData.ticketRefs[idx]}</b></p>
              </div>
            </div>
          ))}
          <p className="instruction">Show each ticket reference to the driver for verification.</p>
        </div>
      );
    }

    if (paymentStatus === "processing") {
      return (
        <div className="payment-processing-section">
          <div className="spinner"></div>
          <p className="processing-text">Processing Payment of {totalFare} via {selectedMethod}...</p>
          <p className="processing-instruction">Do not close this page.</p>
        </div>
      );
    }

    return (
      <>
        <div className="seat-selection-box">
          <p className="seat-label">Selected Seats: {numberOfSeats > 0 ? selectedSeats.join(", ") : "None"}</p>
          <BusLayout capacity={BUS_CAPACITY} selectedSeats={selectedSeats} onSeatToggle={handleSeatToggle} />
        </div>

        <div className="booking-input-group">
          <label className="settings-label">Passenger Full Name</label>
          <input
            type="text"
            className="auth-input"
            placeholder="John Doe"
            value={passengerDetails.name}
            onChange={(e) => setPassengerDetails((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="booking-input-group">
          <label className="settings-label">Phone Number</label>
          <input
            type="tel"
            className="auth-input"
            placeholder="+250 78x xxx xxx"
            value={passengerDetails.number}
            onChange={(e) =>
              setPassengerDetails((prev) => ({ ...prev, number: e.target.value.replace(/[^0-9+]/g, "") }))
            }
          />
        </div>

        <div className="sub-selection-panel">
          <p className="sub-title">Payment Method</p>
          <div className="sub-options-grid">
            {paymentMethods.map((method) => (
              <button
                key={method}
                className={`sub-option-btn ${selectedMethod === method ? "selected" : ""}`}
                onClick={() => { setSelectedMethod(method); setSelectedBank(""); }}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {selectedMethod === "Bank Transfer" && (
          <div className="sub-selection-panel">
            <p className="sub-title">Select Bank</p>
            <div className="sub-options-grid">
              {bankOptions.map((bank) => (
                <button
                  key={bank}
                  className={`sub-option-btn ${selectedBank === bank ? "selected" : ""}`}
                  onClick={() => setSelectedBank(bank)}
                >
                  {bank}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="confirm-fare-box">
          <div className="fare-label">Total Fare for {numberOfSeats} Seat(s)</div>
          <div className="fare-amount">{totalFare}</div>
        </div>

        <div className="confirm-buttons">
          <button className="btn btn-confirm" onClick={handleConfirmPayment}>Confirm Payment</button>
          <button className="btn btn-cancel" onClick={() => window.location.reload()}>Cancel Booking</button>
        </div>
      </>
    );
  };

  return (
    <div className="booking-confirm-page">
      <header className="page-header">
        <h1 className="header-title">Booking Confirmation</h1>
        <p className="header-subtitle">Review your details and complete payment.</p>
      </header>
      <div className="main-content-container">{renderPaymentContent()}</div>
    </div>
  );
}

export default BookingConfirm;
