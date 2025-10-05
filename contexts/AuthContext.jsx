import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { API_CONFIG, authenticatedApiCall, publicApiCall } from '../config/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const userData = await AsyncStorage.getItem('@user_data');
      
      if (accessToken && userData) {
        const parsedUser = JSON.parse(userData);
        
        // Verify token is still valid by making a test API call
        try {
          await authenticatedApiCall(`/users/${parsedUser._id}`);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          if (error.message === 'UNAUTHORIZED') {
            // Token expired, clear everything
            await logout();
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('@user_auth', JSON.stringify(userData));
      await AsyncStorage.setItem('@user_verified', 'true');
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['@user_data', '@user_temp', '@user_auth', '@user_verified']);
      await SecureStore.deleteItemAsync('accessToken');
      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  const updateLocalUser = async (partialUser) => {
    try {
      if (!user) return;
      const updated = { ...user, ...partialUser };
      // Avoid unnecessary re-render if no shallow changes
      const prevStr = JSON.stringify({
        description: user.description,
        tags: user.tags,
        interests: user.interests,
      });
      const nextStr = JSON.stringify({
        description: updated.description,
        tags: updated.tags,
        interests: updated.interests,
      });
      if (prevStr === nextStr) {
        return false; // nothing materially changed
      }
      setUser(updated);
      await AsyncStorage.setItem('@user_data', JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error updating local user:', error);
      return false;
    }
  };

  const sendOTP = async (phoneNumber) => {
    try {
      const phoneNumberInt = parseInt(phoneNumber, 10);
      
      // Use publicApiCall since OTP sending doesn't require authentication
      const data = await publicApiCall(API_CONFIG.ENDPOINTS.SEND_OTP, {
        method: 'POST',
        body: JSON.stringify({ phoneNumber: phoneNumberInt }),
      });
      
      if (data.success && data.statusCode === 200) {
        await AsyncStorage.setItem('@temp_phone', phoneNumber.toString());
        return { success: true, otp: data.data.otp };
      } else {
        return { success: false, error: data.message || 'Failed to send OTP' };
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, error: error.message || 'Network error. Please try again.' };
    }
  };

  const verifyOTP = async (phoneNumber, otpCode) => {
    try {
      const phoneNumberInt = parseInt(phoneNumber, 10);
      
      console.log('Attempting to verify OTP:', {
        phoneNumber: phoneNumberInt,
        otp: otpCode,
        endpoint: API_CONFIG.ENDPOINTS.AUTHENTICATE
      });
      
      // Use publicApiCall since OTP verification creates the authentication
      const data = await publicApiCall(API_CONFIG.ENDPOINTS.AUTHENTICATE, {
        method: 'POST',
        body: JSON.stringify({ phoneNumber: phoneNumberInt, otp: otpCode }),
      });
      
      console.log('OTP Verification Response:', JSON.stringify(data, null, 2));
      
      if (data.success && (data.statusCode === 200 || data.statusCode === 201)) {
        const { accessToken, user } = data.data;
        
        // Store JWT token securely
        await SecureStore.setItemAsync('accessToken', accessToken);
        
        // Store user data
        await AsyncStorage.setItem('@user_data', JSON.stringify(user));
        
        // Clean up temporary phone number
        await AsyncStorage.removeItem('@temp_phone');
        
        console.log('User object from backend:', JSON.stringify(user, null, 2));
        
        setUser(user);
        setIsAuthenticated(true);
        
        return { success: true, user, accessToken };
      } else {
        console.error('OTP verification failed:', data);
        return { success: false, error: data.message || 'Invalid OTP' };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return { success: false, error: error.message || 'Network error. Please try again.' };
    }
  };

  // Function to make authenticated API calls with automatic token handling
  const makeAuthenticatedRequest = async (endpoint, options = {}) => {
    try {
      return await authenticatedApiCall(endpoint, options);
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        // Token is expired/invalid, logout user
        await logout();
        throw new Error('Session expired. Please login again.');
      }
      throw error;
    }
  };

  const completeAuth = async (additionalData = {}) => {
    try {
      const currentUser = { ...user, ...additionalData };
      await AsyncStorage.setItem('@user_auth', JSON.stringify(currentUser));
      await AsyncStorage.setItem('@user_verified', 'true');
      await AsyncStorage.setItem('@user_data', JSON.stringify(currentUser));
      setUser(currentUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error completing auth:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      sendOTP,
      verifyOTP,
      completeAuth,
      checkAuthStatus,
      makeAuthenticatedRequest,
      updateLocalUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};