import { useState, useEffect } from "react";

function SeatSelector({ bus, selectedSeats, onSeatChange }) {
  const totalSeats = 20;
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    const mockTakenSeats = Array.from({ length: totalSeats }, (_, i) =>
      i < totalSeats - bus.seatsLeft ? 1 : 0
    );
    setSeats(mockTakenSeats);
  }, [bus]);

  const toggleSeat = (index) => {
    if (seats[index] === 1) return;
    const updatedSelected = selectedSeats.includes(index)
      ? selectedSeats.filter((s) => s !== index)
      : [...selectedSeats, index];
    onSeatChange(updatedSelected);
  };

  return (
    <div className="seat-selector">
      <h3 className="seat-title">Select Seats for {bus.name}</h3>
      <div className="seats-grid">
        {seats.map((s, i) => (
          <button
            key={i}
            onClick={() => toggleSeat(i)}
            disabled={s === 1}
            className={`seat-btn ${
              s === 1 ? "seat-taken" : selectedSeats.includes(i) ? "seat-selected" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SeatSelector;
