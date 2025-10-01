import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function RouteProtection({ children, requireAuth = true }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-white mt-4 text-base">Loading...</Text>
      </View>
    );
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Redirect href="/(auth)/WhatsAppNumberInput" />;
  }

  // If user is authenticated and trying to access auth pages
  if (!requireAuth && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return children;
}