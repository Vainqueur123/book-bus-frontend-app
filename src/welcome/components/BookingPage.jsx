import { useState, useEffect } from 'react';
import { getActiveBuses } from '../../utils/api';
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
  FaArrowLeft,
  FaMapMarkedAlt,
} from 'react-icons/fa';
import LiveMap from './LiveMap';
import './BookingPage.css';
import { Link, useLocation } from 'react-router-dom';

// Bus Details Form Component
const BusDetailsForm = ({
  bus,
  onBack,
  onBookNow,
  onContinueToSeatSelection,
}) => {
  // Format time to display in 12-hour format
  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format price to 2 decimal places
  const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2);
  };


  return (
    <div className="modal-overlay active">
      <div className="details-popup">
        <div className="popup-header">
          <h2 className="popup-title">Bus Details</h2>
          <button className="close-btn" onClick={onBack}>
            &times;
          </button>
        </div>
        
        <div className="popup-content">
          <div className="popup-section">
            <div className="detail-grid">
              <div className="detail-item">
                <FaBus className="detail-icon" />
                <div>
                  <div className="detail-label">Company</div>
                  <div className="detail-value">{bus.Company || 'Unknown Company'}</div>
                </div>
              </div>
              
              <div className="detail-item">
                <FaMapMarkerAlt className="detail-icon" />
                <div>
                  <div className="detail-label">From</div>
                  <div className="detail-value">{bus.From || 'Departure'}</div>
                </div>
              </div>
              
              <div className="detail-item">
                <FaMapMarkerAlt className="detail-icon" />
                <div>
                  <div className="detail-label">To</div>
                  <div className="detail-value">{bus.Destination || 'Destination'}</div>
                </div>
              </div>
              
              <div className="detail-item">
                <FaClock className="detail-icon" />
                <div>
                  <div className="detail-label">Departure</div>
                  <div className="detail-value">{formatTime(bus.departure_time || bus.created_at)}</div>
                </div>
              </div>
              
              <div className="detail-item">
                <FaClock className="detail-icon" />
                <div>
                  <div className="detail-label">Arrival</div>
                  <div className="detail-value">{formatTime(bus.arrival_time) || '--:--'}</div>
                </div>
              </div>
              
              <div className="detail-item">
                <FaInfoCircle className="detail-icon" />
                <div>
                  <div className="detail-label">Duration</div>
                  <div className="detail-value">{bus.duration || '--h --m'}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="popup-section">
            <h3>Bus Information</h3>
            <div className="detail-grid">
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
                <FaInfoCircle className="detail-icon" />
                <div>
                  <div className="detail-label">Plate Number</div>
                  <div className="detail-value">{bus.busDetails || 'N/A'}</div>
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
                  <div className={`detail-value ${bus.status?.toLowerCase() || 'scheduled'}`}>
                    {bus.status || 'Scheduled'}
                  </div>
                </div>
              </div>

              <div className="detail-item">
                <FaTicketAlt className="detail-icon" />
                <div>
                  <div className="detail-label">Price per Seat</div>
                  <div className="detail-value">${formatPrice(bus.ticket_price)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="popup-actions">
          <button className="btn btn-secondary" onClick={onBack}>
            Close
          </button>
          <button className="btn btn-primary" onClick={onBookNow}>
            <FaTicketAlt className="mr-2" /> Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

function BookingPage() {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showSearchFields, setShowSearchFields] = useState(false);
  const [searchParams, setSearchParams] = useState({
    startPoint: '',
    endPoint: ''
  });
  const location = useLocation();
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies, setCompanies] = useState([]);

  // Format price to 2 decimal places
  const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2);
  };

  // Handle view details
  const handleViewDetails = (bus) => {
    setSelectedBus(bus);
    setShowMap(false);
  };

  // Handle back from details
  const handleBackToList = () => {
    setSelectedBus(null);
  };

  // Handle book now - show the map
  const handleBookNow = () => {
    setShowMap(true);
  };

  // Handle continue to seat selection
  const handleContinueToSeatSelection = () => {
    // Navigate to seat selection with the selected bus
    window.location.href = `/booking/seats?busId=${selectedBus?.id}`;
  };

  // Handle back from map
  const handleBackFromMap = () => {
    setShowMap(false);
  };

  // Format time to display in 12-hour format
  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format date to display day and month
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
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

        // Extract unique companies
        const uniqueCompanies = [
          ...new Set(busesData.map((bus) => bus.Company).filter(Boolean)),
        ].sort();
        setCompanies(uniqueCompanies);

        setBuses(busesData);
        setFilteredBuses(busesData);
      } catch (err) {
        console.error('Error fetching buses:', err);
        setError('Failed to load buses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuses();
  }, []);

  // Filter buses by selected company
  useEffect(() => {
    if (!selectedCompany) {
      setFilteredBuses(buses);
    } else {
      const filtered = buses.filter((bus) => bus.Company === selectedCompany);
      setFilteredBuses(filtered);
    }
  }, [selectedCompany, buses]);

  // Handle company filter change
  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value || '');
  };

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

  // Show map if in map view
  if (showMap && selectedBus) {
    // Add some mock location data for the bus
    const busWithLocation = {
      ...selectedBus,
      location: {
        lat: -1.9441 + (Math.random() * 0.01 - 0.005), // Random position near Kigali
        lng: 30.0619 + (Math.random() * 0.01 - 0.005),
      },
      status: 'On Time',
      speed: Math.floor(Math.random() * 40) + 20 + ' km/h',
    };

    return (
      <div className="booking-page">
        <LiveMap
          bus={busWithLocation}
          onBack={handleBackFromMap}
          onContinue={handleContinueToSeatSelection}
        />
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

  // Render the bus list if no bus is selected and not showing map
  const renderBusList = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading available buses...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          <p>Error loading buses: {error}</p>
          <button className="retry-button" onClick={fetchBuses}>
            Retry
          </button>
        </div>
      );
    }

    if (filteredBuses.length === 0) {
      return (
        <div className="no-buses">
          <p>No buses available at the moment.</p>
        </div>
      );
    }

    return (
      <div className="bus-list-container">
        <div className="bus-list-header">
          <div className="header-company">Company</div>
          <div className="header-route">Route</div>
          <div className="header-plate">Plate</div>
          <div className="header-actions">Actions</div>
        </div>
        <div className="buses-list">
          {filteredBuses.map((bus) => (
            <div key={bus.id} className="bus-list-item">
              <div className="bus-company">
                <FaBus className="bus-icon" />
                <span>{bus.Company || 'Unknown Company'}</span>
              </div>
              <div className="bus-route">
                <span className="from">{bus.From || 'Departure'}</span>
                <FaArrowRight className="route-arrow" />
                <div className="destination-with-time">
                  <span className="to">{bus.Destination || 'Destination'}</span>
                  {bus.created_at && (
                    <span className="created-time">
                      <FaClock className="time-icon" />
                      {new Date(bus.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  )}
                </div>
              </div>
              <div className="bus-plate">
                <span>{bus.busDetails || 'N/A'}</span>
              </div>
              <div className="bus-actions">
                <button
                  className="view-details-btn"
                  onClick={() => handleViewDetails(bus)}
                >
                  View Details
                </button>
                <Link to= "/seats">
                <button
                  className="book-now-btn"
                  onClick={() => {
                    setSelectedBus(bus);
                    handleBookNow();
                  }}
                >
                  Book Now
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Show bus list if no bus is selected
  return (
    <div className="booking-page">
      <div className="page-header">
        <div className="header-content">
          <div className="booking-header">
            <h1 className="booking-title">Available Buses</h1>
            <p className="booking-subtitle">
              Select your preferred bus for booking
            </p>
            <div className="company-filter">
              <select
                value={selectedCompany}
                onChange={handleCompanyChange}
                className="company-select"
              >
                <option value="">Sort by Company</option>
                {companies.map((company, index) => (
                  <option key={index} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {renderBusList()}
    </div>
  );
}

export default BookingPage;
