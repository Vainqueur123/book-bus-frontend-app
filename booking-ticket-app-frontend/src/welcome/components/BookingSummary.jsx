function BookingSummary({ bus, seats, onConfirm }) {
  const totalSeats = seats.length;
  const pricePerSeat = 1000;
  const totalPrice = totalSeats * pricePerSeat;

  if (totalSeats === 0) return <p className="booking-message">Please select at least one seat.</p>;

  return (
    <div className="booking-summary">
      <h3 className="summary-title">Booking Summary</h3>
      <p className="summary-item"><strong>Bus:</strong> {bus.name}</p>
      <p className="summary-item"><strong>Route:</strong> {bus.route}</p>
      <p className="summary-item"><strong>Time:</strong> {bus.time}</p>
      <p className="summary-item"><strong>Seats:</strong> {seats.map((s) => s + 1).join(", ")}</p>
      <p className="summary-item"><strong>Total:</strong> {totalPrice} RWF</p>
      <button onClick={onConfirm} className="btn primary summary-btn">
        Confirm Booking
      </button>
    </div>
  );
}

export default BookingSummary;
