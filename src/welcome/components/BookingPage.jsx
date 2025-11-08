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
    <div className="bus-details-form">
      <div className="bus-details-header">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft className="mr-2" /> Back to Buses
        </button>
        <div className="bus-detail title">Bus Details</div>
      </div>
      <div className="bus-logo-time">
        <div className="bus-company">
          <FaBus className="icon" />
          <div>{bus.Company || 'Unknown Company'}</div>
        </div>
        <div className="form-section">
          <div className="start-time">
            <div className="take-off-point">Take off point:</div>
            <div>{bus.From || 'Departure'}</div>
            <div className="bus-name">
              {' '}
              {formatTime(bus.departure_time || bus.created_at)}
            </div>
            <FaMapMarkerAlt className="location-icon" />
          </div>
          <div className="end-time">
            <div className="end-point">Destination point:</div>
            <span>{bus.Destination || 'Destination'}</span>
            <div className="duration">{bus.duration || '--h --m'}</div>
            <div className="route-time">{formatTime(bus.arrival_time)}</div>
            <FaMapMarkerAlt className="location-icon" />
          </div>
        </div>
      </div>

      <div className="form-section2">
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
              <div
                className={`status-badge ${bus.status?.toLowerCase() || 'scheduled'}`}
              >
                {bus.status || 'Scheduled'}
              </div>
            </div>
          </div>

          <div className="detail-item price-item">
            <div>
              <div className="detail-label">Price per Seat</div>
              <div className="detail-value price">
                ${formatPrice(bus.ticket_price)}
              </div>
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

  // Handle book now - show the map
  const handleBookNow = () => {
    setShowMap(true);
  };

  // Handle continue to seat selection
  const handleContinueToSeatSelection = () => {
    // This will be implemented in the next step
    console.log('Continuing to seat selection for bus:', selectedBus);
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

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value.toLowerCase()
    }));
  };

  // Filter buses based on search parameters
  const filterBuses = (start, end) => {
    return buses.filter(bus => {
      const matchesStart = !start || (bus.From && bus.From.toLowerCase().includes(start));
      const matchesEnd = !end || (bus.Destination && bus.Destination.toLowerCase().includes(end));
      return matchesStart && matchesEnd;
    });
  };

  // Apply search filter
  const applySearch = () => {
    const filtered = filterBuses(searchParams.startPoint, searchParams.endPoint);
    setFilteredBuses(filtered);
  };

  // Reset search
  const resetSearch = () => {
    setSearchParams({ startPoint: '', endPoint: '' });
    setFilteredBuses(buses);
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
        setFilteredBuses(busesData); // Initialize filteredBuses with all buses
      } catch (err) {
        console.error('Error fetching buses:', err);
        setError('Failed to load buses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuses();
  }, []);

  // Read URL query params (?from=...&to=...) and prefill + filter when buses are ready
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const from = params.get('from') || '';
    const to = params.get('to') || '';
    if (!from && !to) return;
    // Prefill fields
    setSearchParams({
      startPoint: from,
      endPoint: to,
    });
    // Apply filter if we have buses
    if (buses.length > 0) {
      const filtered = buses.filter((bus) => {
        const start = from.toLowerCase();
        const end = to.toLowerCase();
        const matchesStart = !start || (bus.From && bus.From.toLowerCase().includes(start));
        const matchesEnd = !end || (bus.Destination && bus.Destination.toLowerCase().includes(end));
        return matchesStart && matchesEnd;
      });
      setFilteredBuses(filtered);
    }
  }, [location.search, buses]);

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
          <p>No buses available for the selected route.</p>
          <button className="clear-filters" onClick={resetSearch}>
            Clear filters
          </button>
        </div>
      );
    }

    return (
      <div className="bus-list-container">
        <div className="bus-list-header">
          <div className="header-company">Company</div>
          <div className="header-route">Route</div>
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
                <span className="to">{bus.Destination || 'Destination'}</span>
              </div>
              <div className="bus-actions">
                <button
                  className="view-details-btn"
                  onClick={() => handleViewDetails(bus)}
                >
                  View Details
                </button>
                <button
                  className="book-now-btn"
                  onClick={() => {
                    setSelectedBus(bus);
                    handleBookNow();
                  }}
                >
                  Book Now
                </button>
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
        <h1 className="booking-title">Available Buses</h1>
        <p className="booking-subtitle">
          Select your preferred bus for booking
        </p>
        
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-fields">
            <div className="search-input-group">
              <FaMapMarkerAlt className="search-field-icon" />
              <input
                type="text"
                name="startPoint"
                placeholder="From"
                value={searchParams.startPoint}
                onChange={handleSearchInputChange}
                className="search-input"
              />
            </div>
            <div className="search-input-group">
              <FaMapMarkerAlt className="search-field-icon" />
              <input
                type="text"
                name="endPoint"
                placeholder="To"
                value={searchParams.endPoint}
                onChange={handleSearchInputChange}
                className="search-input"
              />
            </div>
            <div className="search-buttons">
              <button 
                className="search-apply" 
                onClick={applySearch}
                disabled={!searchParams.startPoint || !searchParams.endPoint}
              >
                Search
              </button>
              <button 
                className="search-clear" 
                onClick={resetSearch}
                disabled={!searchParams.startPoint && !searchParams.endPoint}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {renderBusList()}
    </div>
  );
}

export default BookingPage;
