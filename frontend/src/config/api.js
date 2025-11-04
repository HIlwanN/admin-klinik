// API Configuration for Electron Desktop App and Web (Vercel)
const isDevelopment = import.meta.env.DEV;
const isElectron = window.electronAPI?.isElectron || false;

// Prefer explicit configuration when provided via env (for cloud deployment)
const configuredApiBaseRaw = (import.meta.env.VITE_API_BASE_URL || '').trim();
const configuredApiBase = configuredApiBaseRaw.replace(/\/$/, '');

// For Electron or local dev, use localhost; otherwise use configured base (if any) or relative '/api'
export const API_BASE_URL = (isElectron || isDevelopment)
  ? 'http://localhost:3000'
  : (configuredApiBase || '');

export const API_ENDPOINTS = {
  patients: `${API_BASE_URL}/api/patients`,
  schedules: `${API_BASE_URL}/api/schedules`,
  patientsExport: `${API_BASE_URL}/api/patients/export/csv`,
  schedulesExport: `${API_BASE_URL}/api/schedules/export/csv`,
};

// Helper function for fetch with base URL
export const apiFetch = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  return fetch(url, options);
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  apiFetch
};

