import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import './LandingPage.css';

function Hero() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!from || !to) return;
    const params = new URLSearchParams({ from, to });
    navigate(`/booking?${params.toString()}`);
  };

  return (
    <section className="hero">
      <div className="container hero-inner">
        <h1 className="hero-title">Find your next bus, fast.</h1>
        <p className="hero-subtitle">Search routes from where you are to where you're going.</p>
        <form className="search-form" onSubmit={onSubmit}>
          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <input
              aria-label="From"
              placeholder="From (your current city)"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <input
              aria-label="To"
              placeholder="To (destination)"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <button className="btn btn-cta" type="submit" disabled={!from || !to}>
            <FaSearch />
            <span>Search</span>
          </button>
        </form>
      </div>
    </section>
  );
}

export default Hero;
