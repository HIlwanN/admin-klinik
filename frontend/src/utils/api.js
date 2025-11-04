// API utility with automatic token expiration handling

/**
 * Fetch wrapper that automatically handles expired tokens
 * @param {string} url - API endpoint
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('authToken');
  
  // Add authorization header if token exists
  const headers = {
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  // Handle expired/invalid token
  if (response.status === 403 || response.status === 401) {
    const errorData = await response.json().catch(() => ({}));
    
    // Check if it's a token error
    if (errorData.error && (
      errorData.error.includes('token') || 
      errorData.error.includes('Token') ||
      errorData.error.includes('Session')
    )) {
      console.warn('Token expired or invalid, clearing session');
      localStorage.clear();
      
      // Dispatch custom event for App.jsx to handle
      window.dispatchEvent(new CustomEvent('auth-expired'));
      
      // Return error response
      return {
        ...response,
        ok: false,
        authExpired: true
      };
    }
  }
  
  return response;
}

/**
 * Helper to get JSON response with error handling
 */
export async function apiJson(url, options = {}) {
  const response = await apiFetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ 
      error: `HTTP ${response.status}: ${response.statusText}` 
    }));
    throw new Error(errorData.error || 'Request failed');
  }
  
  return await response.json();
}



