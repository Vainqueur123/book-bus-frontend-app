import BusCard from "./BusCard";

const mockBuses = [
  { id: 1, name: "Bus A", route: "Kigali → Nyabugogo", time: "08:00", seatsLeft: 5 },
  { id: 2, name: "Bus B", route: "Kigali → Musanze", time: "09:30", seatsLeft: 3 },
  { id: 3, name: "Bus C", route: "Kigali → Rubavu", time: "10:00", seatsLeft: 0 },
];

function BusList({ onBusSelect }) {
  return (
    <div className="bus-list">
      <h2 className="bus-list-title">Available Buses</h2>
      {mockBuses.map((bus) => (
        <BusCard key={bus.id} bus={bus} onSelect={() => onBusSelect(bus)} />
      ))}
    </div>
  );
}

export default BusList;
