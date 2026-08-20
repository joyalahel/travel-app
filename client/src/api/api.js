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

export async function getHotels(packageId) {
  const res = await fetch(`${BASE_URL}/hotels?package=${packageId}`);
  if (!res.ok) throw new Error('Failed to fetch hotels');
  return res.json();
}