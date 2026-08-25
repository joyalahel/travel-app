import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getDestinations, createDestination, updateDestination, deleteDestination,
  getPackages, createPackage, updatePackage, deletePackage,
  getHotels, createHotel, updateHotel, deleteHotel,
} from '../api/api';
import './Admin.css';

function Admin() {
  const { user, token } = useAuth();
  const [tab, setTab] = useState('destinations');

  if (!user) return <p className="state-message">Please sign in to access the admin panel.</p>;
  if (user.role !== 'admin') return <p className="state-message">Admin access required.</p>;

  return (
    <div className="admin-page">
      <h1>Admin panel</h1>

      <div className="admin-tabs">
        <button type="button" className={tab === 'destinations' ? 'active' : ''} onClick={() => setTab('destinations')}>Destinations</button>
        <button type="button" className={tab === 'packages' ? 'active' : ''} onClick={() => setTab('packages')}>Packages</button>
        <button type="button" className={tab === 'hotels' ? 'active' : ''} onClick={() => setTab('hotels')}>Hotels</button>
      </div>

      {tab === 'destinations' && <DestinationsAdmin token={token} />}
      {tab === 'packages' && <PackagesAdmin token={token} />}
      {tab === 'hotels' && <HotelsAdmin token={token} />}
    </div>
  );
}

// ---------- Destinations ----------
function DestinationsAdmin({ token }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', country: '', city: '', description: '', tags: '', image: '' });
  const [error, setError] = useState('');

  function load() {
    getDestinations().then(setItems).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  function startEdit(item) {
    setEditing(item._id);
    setForm({
      name: item.name, country: item.country, city: item.city,
      description: item.description || '', tags: (item.tags || []).join(', '), image: item.image || '',
    });
  }

  function resetForm() {
    setEditing(null);
    setForm({ name: '', country: '', city: '', description: '', tags: '', image: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const payload = { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) };
    try {
      if (editing) {
        await updateDestination(editing, payload, token);
      } else {
        await createDestination(payload, token);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this destination?')) return;
    try {
      await deleteDestination(id, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-section">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editing ? 'Edit destination' : 'Add destination'}</h2>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
        <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        {error && <p className="field-error">{error}</p>}
        <div className="admin-form-actions">
          <button type="submit">{editing ? 'Save changes' : 'Add destination'}</button>
          {editing && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <div className="admin-list">
        {items.map((item) => (
          <div key={item._id} className="admin-list-item">
            <div>
              <strong>{item.name}</strong> — {item.city}, {item.country}
            </div>
            <div className="admin-list-actions">
              <button type="button" onClick={() => startEdit(item)}>Edit</button>
              <button type="button" onClick={() => handleDelete(item._id)} className="danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Packages ----------
function PackagesAdmin({ token }) {
  const [items, setItems] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ destination: '', stars: 3, roomType: 'standard', nights: 3 });
  const [error, setError] = useState('');

  function load() {
    getPackages().then(setItems).catch((err) => setError(err.message));
    getDestinations().then(setDestinations).catch(() => {});
  }

  useEffect(load, []);

  function startEdit(item) {
    setEditing(item._id);
    setForm({
      destination: item.destination?._id || '', stars: item.stars, roomType: item.roomType, nights: item.nights,
    });
  }

  function resetForm() {
    setEditing(null);
    setForm({ destination: '', stars: 3, roomType: 'standard', nights: 3 });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const payload = { ...form, stars: Number(form.stars), nights: Number(form.nights) };
    try {
      if (editing) {
        await updatePackage(editing, payload, token);
      } else {
        await createPackage(payload, token);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this package?')) return;
    try {
      await deletePackage(id, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-section">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editing ? 'Edit package' : 'Add package'}</h2>
        <select value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required>
          <option value="">Select destination</option>
          {destinations.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        <select value={form.stars} onChange={(e) => setForm({ ...form, stars: e.target.value })}>
          <option value={3}>3 stars</option>
          <option value={4}>4 stars</option>
          <option value={5}>5 stars</option>
        </select>
        <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}>
          <option value="standard">Standard</option>
          <option value="deluxe">Deluxe</option>
          <option value="suite">Suite</option>
        </select>
        <input type="number" min="1" placeholder="Nights" value={form.nights} onChange={(e) => setForm({ ...form, nights: e.target.value })} required />
        {error && <p className="field-error">{error}</p>}
        <div className="admin-form-actions">
          <button type="submit">{editing ? 'Save changes' : 'Add package'}</button>
          {editing && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <div className="admin-list">
        {items.map((item) => (
          <div key={item._id} className="admin-list-item">
            <div>
              <strong>{item.destination?.name || 'Unknown'}</strong> — {item.stars}★ {item.roomType}, {item.nights} nights
            </div>
            <div className="admin-list-actions">
              <button type="button" onClick={() => startEdit(item)}>Edit</button>
              <button type="button" onClick={() => handleDelete(item._id)} className="danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Hotels ----------
function HotelsAdmin({ token }) {
  const [items, setItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ package: '', name: '', pricePerNight: '', description: '', image: '' });
  const [error, setError] = useState('');

  function load() {
    getHotels().then(setItems).catch((err) => setError(err.message));
    getPackages().then(setPackages).catch(() => {});
  }

  useEffect(load, []);

  function startEdit(item) {
    setEditing(item._id);
    setForm({
      package: item.package?._id || '', name: item.name, pricePerNight: item.pricePerNight,
      description: item.description || '', image: item.image || '',
    });
  }

  function resetForm() {
    setEditing(null);
    setForm({ package: '', name: '', pricePerNight: '', description: '', image: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const payload = { ...form, pricePerNight: Number(form.pricePerNight) };
    try {
      if (editing) {
        await updateHotel(editing, payload, token);
      } else {
        await createHotel(payload, token);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this hotel?')) return;
    try {
      await deleteHotel(id, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-section">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editing ? 'Edit hotel' : 'Add hotel'}</h2>
        <select value={form.package} onChange={(e) => setForm({ ...form, package: e.target.value })} required>
          <option value="">Select package</option>
          {packages.map((p) => (
            <option key={p._id} value={p._id}>
              {p.destination?.name || 'Unknown'} — {p.stars}★ {p.roomType}
            </option>
          ))}
        </select>
        <input placeholder="Hotel name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="number" min="0" placeholder="Price per night" value={form.pricePerNight} onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })} required />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        {error && <p className="field-error">{error}</p>}
        <div className="admin-form-actions">
          <button type="submit">{editing ? 'Save changes' : 'Add hotel'}</button>
          {editing && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <div className="admin-list">
        {items.map((item) => (
          <div key={item._id} className="admin-list-item">
            <div>
              <strong>{item.name}</strong> — ${item.pricePerNight}/night
            </div>
            <div className="admin-list-actions">
              <button type="button" onClick={() => startEdit(item)}>Edit</button>
              <button type="button" onClick={() => handleDelete(item._id)} className="danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;