function BusCard({ bus, onSelect }) {
  return (
    <div className="bus-card">
      <h3 className="bus-name">{bus.name}</h3>
      <p className="bus-info"><strong>Route:</strong> {bus.route}</p>
      <p className="bus-info"><strong>Time:</strong> {bus.time}</p>
      <p className="bus-info"><strong>Seats Left:</strong> {bus.seatsLeft}</p>
      <button
        onClick={onSelect}
        disabled={bus.seatsLeft === 0}
        className="btn primary bus-btn"
      >
        {bus.seatsLeft === 0 ? "Full" : "Book Now"}
      </button>
    </div>
  );
}

export default BusCard;
