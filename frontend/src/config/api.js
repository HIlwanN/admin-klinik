// API Configuration for Electron Desktop App
const isDevelopment = import.meta.env.DEV;
const isElectron = window.electronAPI?.isElectron || false;

// For Electron, always use localhost
// For web development, use relative paths
export const API_BASE_URL = isElectron || isDevelopment 
  ? 'http://localhost:3000' 
  : '';

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

