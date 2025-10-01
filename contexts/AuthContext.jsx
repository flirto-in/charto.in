import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_auth');
      const isVerified = await AsyncStorage.getItem('@user_verified');
      
      if (userData && isVerified === 'true') {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
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
  };

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('@user_auth', JSON.stringify(userData));
      await AsyncStorage.setItem('@user_verified', 'true');
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
      await AsyncStorage.multiRemove(['@user_auth', '@user_verified', '@user_data']);
      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  const savePhoneNumber = async (phoneNumber) => {
    try {
      const userData = {
        phoneNumber,
        uid: 'USR' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        isPhoneVerified: false,
        joinedAt: new Date().toISOString()
      };
      
      await AsyncStorage.setItem('@user_temp', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error saving phone number:', error);
      return null;
    }
  };

  const verifyOTP = async () => {
    try {
      const tempUser = await AsyncStorage.getItem('@user_temp');
      if (tempUser) {
        const userData = JSON.parse(tempUser);
        userData.isPhoneVerified = true;
        
        await AsyncStorage.setItem('@user_auth', JSON.stringify(userData));
        await AsyncStorage.removeItem('@user_temp');
        setUser(userData);
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return null;
    }
  };

  const completeAuth = async (additionalData = {}) => {
    try {
      const currentUser = { ...user, ...additionalData };
      await AsyncStorage.setItem('@user_auth', JSON.stringify(currentUser));
      await AsyncStorage.setItem('@user_verified', 'true');
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
      savePhoneNumber,
      verifyOTP,
      completeAuth,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};