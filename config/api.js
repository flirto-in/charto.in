import * as SecureStore from 'expo-secure-store';

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://flirto.onrender.com/api/v1',
  ENDPOINTS: {
    SEND_OTP: '/auth/send-otp',
    AUTHENTICATE: '/auth/authintication',
    USER_PROFILE: '/users/', // /users/{userId} to get specific user profile
    UPDATE_PROFILE: '/users/', // method patch /users/{userId} to update specific user profile
    CHECK_UID_AVAILABILITY: '/users/check-uid/', // method get /users/check-uid/{uid} to check if U_Id is available
    TEST_UPDATE: '/users/test/', // method patch /users/test/{userId} for testing
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

// Profile Update API Functions
export const updateUserProfile = async (userId, profileData) => {
  try {
    console.log('=== PROFILE UPDATE DEBUG ===');
    console.log('User ID:', userId);
    console.log('Profile Data (incoming):', profileData);

    if (!userId) throw new Error('User ID is required');

    const cleanData = {
      // include U_Id if caller passed it (backend may expect it even if unchanged)
      ...(profileData.U_Id ? { U_Id: String(profileData.U_Id).trim() } : {}),
      description: profileData.description?.trim() || '',
      tags: Array.isArray(profileData.tags) ? profileData.tags.filter(t => t && t.trim()).slice(0,3) : [],
      interests: Array.isArray(profileData.interests) ? profileData.interests.filter(i => i && i.trim()).slice(0,10) : [],
    };

    if (cleanData.description.length > 200) cleanData.description = cleanData.description.slice(0,200);

    const endpoint = `${API_CONFIG.ENDPOINTS.UPDATE_PROFILE}${userId}`;
    const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
    console.log('[ProfileUpdate] Attempt PATCH', fullUrl, cleanData);

    let response;
    let methodTried = 'PATCH';
    try {
      response = await authenticatedApiCall(endpoint, { method: 'PATCH', body: JSON.stringify(cleanData) });
    } catch (patchErr) {
      // Fallback logic: some backends implemented only PATCH
      if (patchErr.message.includes('405') || patchErr.message.includes('Cannot') || patchErr.message.includes('method') || patchErr.message.includes('500')) {
        console.warn('[ProfileUpdate] PATCH failed, retrying with PATCH. Reason:', patchErr.message);
        methodTried = 'PATCH';
        response = await authenticatedApiCall(endpoint, { method: 'PATCH', body: JSON.stringify(cleanData) });
      } else {
        throw patchErr;
      }
    }

    console.log(`[ProfileUpdate] ${methodTried} success:`, response);
    console.log('=== END DEBUG ===');
    return { ...response, meta: { methodUsed: methodTried } };
  } catch (error) {
    console.error('=== PROFILE UPDATE ERROR ===');
    console.error('Error details:', { message: error.message, stack: error.stack });
    console.error('Hint: If backend only supports PATCH, keep fallback or switch permanently.');
    throw error;
  }
};

export const checkUidAvailability = async (uid) => {
  try {
    const response = await authenticatedApiCall(`${API_CONFIG.ENDPOINTS.CHECK_UID_AVAILABILITY}${uid}`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Error checking UID availability:', error);
    throw error;
  }
};

// Test function to diagnose backend issues
export const testBackendEndpoints = async (userId) => {
  const results = {
    getProfile: { tested: false, success: false, error: null },
    updateProfile: { tested: false, success: false, error: null },
    baseUrl: API_CONFIG.BASE_URL,
    userId: userId
  };

  // Test GET endpoint first
  try {
    console.log('Testing GET /users/:id endpoint...');
    const getResponse = await authenticatedApiCall(`${API_CONFIG.ENDPOINTS.USER_PROFILE}${userId}`, {
      method: 'GET',
    });
    results.getProfile = { tested: true, success: true, response: getResponse };
    console.log('✅ GET endpoint works');
  } catch (error) {
    results.getProfile = { tested: true, success: false, error: error.message };
    console.log('❌ GET endpoint failed:', error.message);
  }

  // Test PATCH endpoint with minimal data
  try {
    console.log('Testing PATCH /users/:id endpoint...');
    const testData = { description: 'Test update' };
    const putResponse = await authenticatedApiCall(`${API_CONFIG.ENDPOINTS.UPDATE_PROFILE}${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(testData),
    });
    results.updateProfile = { tested: true, success: true, response: putResponse };
    console.log('✅ PATCH endpoint works');
  } catch (error) {
    results.updateProfile = { tested: true, success: false, error: error.message };
    console.log('❌ PATCH endpoint failed:', error.message);
  }

  return results;
};

// NOTE: CHECK_UID_AVAILABILITY and TEST_UPDATE are currently not used by the active profile update UI.
// They are retained for future features (custom U_Id / diagnostics). Marked as deprecated for now.
// If unused for a while, consider removing to reduce bundle size.

