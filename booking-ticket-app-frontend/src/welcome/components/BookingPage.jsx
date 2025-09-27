import { useState, useEffect } from "react";
import { getActiveBuses } from "../../utils/api";
import { 
  FaBus, 
  FaMapMarkerAlt, 
  FaClock, 
  FaChair, 
  FaArrowRight, 
  FaUserTie, 
  FaPhoneAlt,
  FaTicketAlt,
  FaInfoCircle,
  FaArrowLeft
} from "react-icons/fa";
import "./BookingPage.css";

// Bus Details Form Component
const BusDetailsForm = ({ bus, onBack, onBookNow }) => {
  // Format time to display in 12-hour format
  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  // Format price to 2 decimal places
  const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2);
  };

  return (
    <div className="bus-details-form">
      <button className="back-button" onClick={onBack}>
        <FaArrowLeft className="mr-2" /> Back to Buses
      </button>
      
      <div className="form-header">
        <h2>Bus Details</h2>
        <div className="bus-company">
          <FaBus className="icon" />
          <h3>{bus.Company || 'Unknown Company'}</h3>
        </div>
      </div>

      <div className="form-section">
        <h3>Journey Information</h3>
        <div className="route-container">
          <div className="route-info">
            <div className="route-time">{formatTime(bus.departure_time || bus.created_at)}</div>
            <div className="route-location">
              <FaMapMarkerAlt className="location-icon" />
              <span>{bus.From || 'Departure'}</span>
            </div>
          </div>
          
          <div className="route-separator">
            <FaArrowRight className="arrow-icon" />
            <div className="duration">{bus.duration || '--h --m'}</div>
          </div>
          
          <div className="route-info">
            <div className="route-time">{formatTime(bus.arrival_time)}</div>
            <div className="route-location">
              <FaMapMarkerAlt className="location-icon" />
              <span>{bus.Destination || 'Destination'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Bus Information</h3>
        <div className="bus-details-grid">
          <div className="detail-item">
            <FaChair className="detail-icon" />
            <div>
              <div className="detail-label">Available Seats</div>
              <div className="detail-value">{bus.available_seats || 0}</div>
            </div>
          </div>
          
          <div className="detail-item">
            <FaUserTie className="detail-icon" />
            <div>
              <div className="detail-label">Driver</div>
              <div className="detail-value">{bus.driver || 'Not Assigned'}</div>
            </div>
          </div>
          
          <div className="detail-item">
            <FaPhoneAlt className="detail-icon" />
            <div>
              <div className="detail-label">Contact</div>
              <div className="detail-value">{bus.contact_number || 'N/A'}</div>
            </div>
          </div>
          
          <div className="detail-item">
            <FaInfoCircle className="detail-icon" />
            <div>
              <div className="detail-label">Status</div>
              <div className={`status-badge ${bus.status?.toLowerCase() || 'scheduled'}`}>
                {bus.status || 'Scheduled'}
              </div>
            </div>
          </div>

          <div className="detail-item price-item">
            <div>
              <div className="detail-label">Price per Seat</div>
              <div className="detail-value price">${formatPrice(bus.ticket_price)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" onClick={onBookNow}>
          <FaTicketAlt className="mr-2" /> Book Now
        </button>
      </div>
    </div>
  );
};

function BookingPage() {
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);

  // Format price to 2 decimal places
  const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2);
  };

  // Handle view details
  const handleViewDetails = (bus) => {
    setSelectedBus(bus);
  };

  // Handle back from details
  const handleBackToList = () => {
    setSelectedBus(null);
  };

  // Handle book now
  const handleBookNow = () => {
    // Implement booking logic here
    console.log('Booking bus:', selectedBus);
  };

  // Format time to display in 12-hour format
  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Format date to display day and month
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Fetch active buses when component mounts
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching buses...');
        
        const busesData = await getActiveBuses();
        console.log('Fetched buses:', busesData);
        
        if (!busesData || busesData.length === 0) {
          console.warn('No buses found in the database');
          setError('No buses available at the moment.');
          return;
        }
        
        setBuses(busesData);
      } catch (err) {
        console.error('Error fetching buses:', err);
        setError('Failed to load buses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuses();
  }, []);

  if (isLoading) {
    return (
      <div className="booking-page">
        <h1 className="booking-title">Loading Buses...</h1>
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-page">
        <h1 className="booking-title">Error</h1>
        <div className="error-message">
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (buses.length === 0) {
    return (
      <div className="booking-page">
        <h1 className="booking-title">No Buses Available</h1>
        <p>There are currently no buses available. Please check back later.</p>
      </div>
    );
  }

  // Show bus details form if a bus is selected
  if (selectedBus) {
    return (
      <div className="booking-page">
        <BusDetailsForm 
          bus={selectedBus} 
          onBack={handleBackToList} 
          onBookNow={handleBookNow} 
        />
      </div>
    );
  }

  // Show bus list if no bus is selected
  return (
    <div className="booking-page">
      <div className="page-header">
        <h1 className="booking-title">Available Buses</h1>
        <p className="booking-subtitle">Select your preferred bus for booking</p>
      </div>
      
      <div className="bus-list">
        {buses.map((bus) => (
          <div key={bus.id} className="bus-card">
            <div className="bus-card-summary">
              <div className="bus-info">
                <div className="bus-company">
                  <FaBus className="icon" />
                  <h3>{bus.Company || 'Unknown Company'}</h3>
                </div>
                <div className="bus-time">
                  <div className="departure-time">
                    <span className="time">{formatTime(bus.departure_time || bus.created_at)}</span>
                    <span className="date">{formatDate(bus.departure_time || bus.created_at)}</span>
                    <span className="place">{bus.From}</span>
                  </div>
                  <FaArrowRight className="arrow-icon" />
                  <div className="arrival-time">
                    <span className="time">{formatTime(bus.arrival_time)}</span>
                    <span className="place">{bus.Destination}</span>
                  </div>
                </div>
                <div className="price-tag">
                  ${formatPrice(bus.ticket_price)}
                  <span className="price-label">per seat</span>
                </div>
              </div>
              <button 
                className="view-details-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(bus);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingPage;
