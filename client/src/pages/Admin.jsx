import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';
import Rating from '@mui/material/Rating';
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
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({
    name: '', country: '', city: '', description: '', tagline: '', bestSeason: '',
    tags: '', image: '',
  });
  const [activityRows, setActivityRows] = useState([{ name: '', image: '' }]);
  const [error, setError] = useState('');

  function load() {
    getDestinations().then(setItems).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  function startEdit(item) {
    setEditing(item._id);
    setForm({
      name: item.name, country: item.country, city: item.city,
      description: item.description || '', tagline: item.tagline || '', bestSeason: item.bestSeason || '',
      tags: (item.tags || []).join(', '), image: item.image || '',
    });
    setActivityRows(
      item.activities && item.activities.length > 0
        ? item.activities.map((a) => ({ name: a.name || '', image: a.image || '' }))
        : [{ name: '', image: '' }]
    );
  }

  function resetForm() {
    setEditing(null);
    setForm({ name: '', country: '', city: '', description: '', tagline: '', bestSeason: '', tags: '', image: '' });
    setActivityRows([{ name: '', image: '' }]);
  }

  function updateActivityRow(index, field, value) {
    setActivityRows((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function addActivityRow() {
    setActivityRows((rows) => [...rows, { name: '', image: '' }]);
  }

  function removeActivityRow(index) {
    setActivityRows((rows) => rows.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      activities: activityRows.filter((row) => row.name.trim()),
    };
    try {
      if (editing) {
        await updateDestination(editing, payload, token);
        showToast('Destination updated!');
      } else {
        await createDestination(payload, token);
        showToast('Destination added!');
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    }
  }

  async function confirmDelete() {
    try {
      await deleteDestination(deleteTarget, token);
      showToast('Destination deleted');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="admin-section">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editing ? 'Edit destination' : 'Add destination'}</h2>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
        <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <input placeholder="Tagline (short, punchy)" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Best time to visit (e.g. April – June)" value={form.bestSeason} onChange={(e) => setForm({ ...form, bestSeason: e.target.value })} />
        <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />

        <label className="admin-subheading">Activities</label>
        {activityRows.map((row, i) => (
          <div key={i} className="activity-row">
            <input
              placeholder="Activity name"
              value={row.name}
              onChange={(e) => updateActivityRow(i, 'name', e.target.value)}
            />
            <input
              placeholder="Activity image URL"
              value={row.image}
              onChange={(e) => updateActivityRow(i, 'image', e.target.value)}
            />
            <button type="button" onClick={() => removeActivityRow(i)} className="remove-row-btn">✕</button>
          </div>
        ))}
        <button type="button" onClick={addActivityRow} className="add-row-btn">+ Add activity</button>

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
              <button type="button" onClick={() => setDeleteTarget(item._id)} className="danger">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this destination?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

// ---------- Packages ----------
function PackagesAdmin({ token }) {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
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
        showToast('Package updated!');
      } else {
        await createPackage(payload, token);
        showToast('Package added!');
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    }
  }

  async function confirmDelete() {
    try {
      await deletePackage(deleteTarget, token);
      showToast('Package deleted');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleteTarget(null);
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
              <strong>{item.destination?.name || 'Unknown'}</strong>
              <Rating value={item.stars} readOnly size="small" sx={{ verticalAlign: 'middle', mx: 0.5 }} />
              {item.roomType}, {item.nights} nights
            </div>
            <div className="admin-list-actions">
              <button type="button" onClick={() => startEdit(item)}>Edit</button>
              <button type="button" onClick={() => setDeleteTarget(item._id)} className="danger">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this package?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

// ---------- Hotels ----------
function HotelsAdmin({ token }) {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ package: '', name: '', pricePerNight: '', description: '', image: '', amenities: ''  });
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
      description: item.description || '', image: item.image || '', amenities: (item.amenities || []).join(', '),
    });
  }

  function resetForm() {
    setEditing(null);
    setForm({ package: '', name: '', pricePerNight: '', description: '', image: '', amenities: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const payload = { ...form, pricePerNight: Number(form.pricePerNight), amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean), };
    try {
      if (editing) {
        await updateHotel(editing, payload, token);
        showToast('Hotel updated!');
      } else {
        await createHotel(payload, token);
        showToast('Hotel added!');
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    }
  }

  async function confirmDelete() {
    try {
      await deleteHotel(deleteTarget, token);
      showToast('Hotel deleted');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleteTarget(null);
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
        <input placeholder="Amenities (comma separated, e.g. Pool, Wifi, Gym, Spa)" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
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
              <button type="button" onClick={() => setDeleteTarget(item._id)} className="danger">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this hotel?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Admin;