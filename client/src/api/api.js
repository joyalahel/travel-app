const BASE_URL = 'http://localhost:5000/api';

export async function getDestinations() {
  const res = await fetch(`${BASE_URL}/destinations`);
  if (!res.ok) throw new Error('Failed to fetch destinations');
  return res.json();
}

export async function getPackages(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`${BASE_URL}/packages?${query}`);
  if (!res.ok) throw new Error('Failed to fetch packages');
  return res.json();
}

export async function getHotels(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const queryString = query ? `?${query}` : '';
  const res = await fetch(`${BASE_URL}/hotels${queryString}`);
  if (!res.ok) throw new Error('Failed to fetch hotels');
  return res.json();
}

export async function signup(name, email, password) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Signup failed');
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}
function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// Destinations
export async function createDestination(data, token) {
  const res = await fetch(`${BASE_URL}/destinations`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to create destination');
  return result;
}

export async function updateDestination(id, data, token) {
  const res = await fetch(`${BASE_URL}/destinations/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to update destination');
  return result;
}

export async function deleteDestination(id, token) {
  const res = await fetch(`${BASE_URL}/destinations/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to delete destination');
  return result;
}

// Packages
export async function createPackage(data, token) {
  const res = await fetch(`${BASE_URL}/packages`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to create package');
  return result;
}

export async function updatePackage(id, data, token) {
  const res = await fetch(`${BASE_URL}/packages/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to update package');
  return result;
}

export async function deletePackage(id, token) {
  const res = await fetch(`${BASE_URL}/packages/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to delete package');
  return result;
}

// Hotels
export async function createHotel(data, token) {
  const res = await fetch(`${BASE_URL}/hotels`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to create hotel');
  return result;
}

export async function updateHotel(id, data, token) {
  const res = await fetch(`${BASE_URL}/hotels/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to update hotel');
  return result;
}

export async function deleteHotel(id, token) {
  const res = await fetch(`${BASE_URL}/hotels/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to delete hotel');
  return result;
}