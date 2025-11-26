const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function get(path: string, auth = false) {
  const headers: Record<string,string> = {};
  if (auth) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Missing access token. Please log in to perform this action.');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json?.message || JSON.stringify(json));
    } catch {
      throw new Error(text || res.statusText || 'Request failed');
    }
  }
  return res.json();
}

export async function post(path: string, body: any, auth = true) {
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Missing access token. Please log in to perform this action.');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json?.message || JSON.stringify(json));
    } catch {
      throw new Error(text || res.statusText || 'Request failed');
    }
  }
  return res.json();
}

export function setToken(token: string) { localStorage.setItem('accessToken', token); }
export function clearToken() { localStorage.removeItem('accessToken'); }
