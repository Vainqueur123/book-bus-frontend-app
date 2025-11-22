import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { RWANDA_LOCATIONS } from '../utils/constants';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    id: null,
    from: '',
    to: '',
    departure_time: '',
    arrival_time: '',
    price: '',
    seats: '',
    company_id: '',
  });

  useEffect(() => {
    const raw = localStorage.getItem('admin_session');
    if (!raw) {
      navigate('/');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setAdmin(parsed);
      setForm((f) => ({ ...f, company_id: parsed?.company_id }));
    } catch {
      navigate('/');
    }
  }, [navigate]);

  const companyId = admin?.company_id;
  const companyName = admin?.companyName || admin?.companies?.company_name || '';

  useEffect(() => {
    const fetchBuses = async () => {
      if (!companyId) return;
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('Activebuses')
        .select('*')
        .eq('company_id', companyId)
        .order('departure_time', { ascending: true });
      if (error) setError(error.message || 'Failed to load buses');
      setBuses(data || []);
      setLoading(false);
    };
    fetchBuses();
  }, [companyId]);

  const resetForm = () => {
    setForm({
      id: null,
      from: '',
      to: '',
      departure_time: '',
      arrival_time: '',
      price: '',
      seats: '',
      company_id: companyId || '',
    });
  };

  const onEdit = (bus) => {
    setForm({
      id: bus.id,
      from: bus.From,
      to: bus.Destination,
      departure_time: bus.departure_time,
      arrival_time: bus.arrival_time,
      price: bus.price,
      seats: bus.seats,
      company_id: bus.company_id,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyId) return;
    setSaving(true);
    setError('');

    const payload = {
      From: form.from,
      Destination: form.to,
      departure_time: form.departure_time,
      arrival_time: form.arrival_time,
      price: Number(form.price),
      seats: Number(form.seats),
      company_id: companyId,
    };

    try {
      if (form.id) {
        const { error } = await supabase
          .from('Activebuses')
          .update(payload)
          .eq('id', form.id)
          .eq('company_id', companyId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('Activebuses')
          .insert([payload]);
        if (error) throw error;
      }
      // refresh list
      const { data, error } = await supabase
        .from('Activebuses')
        .select('*')
        .eq('company_id', companyId)
        .order('departure_time', { ascending: true });
      if (error) throw error;
      setBuses(data || []);
      resetForm();
    } catch (ex) {
      setError(ex?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    navigate('/');
  };

  const locationOptions = useMemo(() => RWANDA_LOCATIONS, []);

  if (!admin) return null;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-meta">
          <span>Company: {companyName || companyId}</span>
          <button className="btn-accent" onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="admin-content">
        <form className="bus-form" onSubmit={handleSubmit}>
          <h2>{form.id ? 'Edit Bus' : 'Add New Bus'}</h2>
          {error && <div className="error-banner">{error}</div>}

          <div className="grid-2">
            <div className="form-group">
              <label>From</label>
              <select name="from" value={form.from} onChange={handleChange} required>
                <option value="" disabled>Select location</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Destination</label>
              <select name="to" value={form.to} onChange={handleChange} required>
                <option value="" disabled>Select location</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label>Departure Time</label>
              <input type="datetime-local" name="departure_time" value={form.departure_time} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Arrival Time</label>
              <input type="datetime-local" name="arrival_time" value={form.arrival_time} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Seats</label>
              <input type="number" min="1" step="1" name="seats" value={form.seats} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input type="text" value={companyName || companyId || ''} disabled readOnly />
            </div>
          </div>

          <div className="actions">
            <button className="btn-accent" type="submit" disabled={saving}>{saving ? 'Saving...' : form.id ? 'Update Bus' : 'Add Bus'}</button>
            {form.id && (
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel Edit</button>
            )}
          </div>
        </form>

        <div className="bus-list">
          <h2>Your Buses</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="cards">
              {buses.length === 0 && <p>No buses yet.</p>}
              {buses.map((bus) => (
                <div key={bus.id} className="card">
                  <div className="card-row"><strong>{bus.From}</strong> → <strong>{bus.Destination}</strong></div>
                  <div className="card-row">Departs: {new Date(bus.departure_time).toLocaleString()}</div>
                  <div className="card-row">Arrives: {new Date(bus.arrival_time).toLocaleString()}</div>
                  <div className="card-row">Price: {bus.price}</div>
                  <div className="card-row">Seats: {bus.seats}</div>
                  <div className="card-actions">
                    <button className="btn-small" onClick={() => onEdit(bus)}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
