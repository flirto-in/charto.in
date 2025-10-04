import * as SecureStore from 'expo-secure-store';

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://flirto.onrender.com/api/v1',
  ENDPOINTS: {
    SEND_OTP: '/auth/send-otp',
    AUTHENTICATE: '/auth/authintication',
    USER_PROFILE: '/users/', // /users/{userId} to get specific user profile
    UPDATE_PROFILE: '/users/', // /users/{userId} to update specific user profile
    // Add more protected endpoints here
    GET_MESSAGES: '/messages',
    SEND_MESSAGE: '/messages/send',
  },
  TIMEOUT: 10000,
};

// Helper function to get JWT token
const getAuthToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('accessToken');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Base API call function with automatic token handling
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  console.log('Making API call to:', url);
  console.log('With options:', JSON.stringify(options, null, 2));
  
  // Get JWT token for authenticated requests
  const token = await getAuthToken();
  
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Automatically add Authorization header if token exists
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    timeout: API_CONFIG.TIMEOUT,
    ...options,
  };

  console.log('Request headers:', config.headers);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      let errorText;
      let errorData;
      
      // Clone the response so we can read it multiple times if needed
      const responseClone = response.clone();
      
      try {
        // Try to parse as JSON first to get structured error
        errorData = await response.json();
        errorText = JSON.stringify(errorData, null, 2);
        console.error(`HTTP ${response.status} error (JSON):`, errorData);
      } catch (_jsonError) {
        // If not JSON, get as text from the cloned response
        try {
          errorText = await responseClone.text();
          console.error(`HTTP ${response.status} error (Text):`, errorText);
        } catch (_textError) {
          errorText = `Unable to read error response: ${_textError.message}`;
          console.error(`HTTP ${response.status} error - Unable to read response:`, _textError);
        }
      }
      
      // Handle token expiration/unauthorized
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      
      // For 500 errors, provide more specific information
      if (response.status === 500) {
        throw new Error(`Server Error (500): The server encountered an internal error. Details: ${errorText}`);
      }
      
      // Use the structured error message if available
      const errorMessage = errorData?.message || errorData?.error || errorText || 'Unknown error';
      throw new Error(`HTTP error! status: ${response.status} - ${errorMessage}`);
    }
    
    const data = await response.json();
    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('API call error:', error);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (error.message.includes('Network request failed')) {
      throw new Error('Network error. Please check your connection.');
    }
    
    // Re-throw unauthorized errors for handling in AuthContext
    if (error.message === 'UNAUTHORIZED') {
      throw new Error('UNAUTHORIZED');
    }
    
    throw error;
  }
};

// Helper function for making authenticated API calls (requires token)
export const authenticatedApiCall = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('UNAUTHORIZED');
  }
  
  return apiCall(endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
};

// Helper function for making public API calls (no token required)
export const publicApiCall = async (endpoint, options = {}) => {
  return apiCall(endpoint, {
    ...options,
    // Don't include Authorization header for public endpoints
  });
};