import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

export default function GoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { completeAuth } = useAuth();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Complete authentication with Google account info
      const success = await completeAuth({
        googleAccount: {
          email: 'user@gmail.com',
          name: 'Anonymous User',
          connectedAt: new Date().toISOString()
        }
      });
      
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Failed to complete setup');
      }
    } catch (_error) {
      Alert.alert('Error', 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipForNow = async () => {
    try {
      // Complete authentication without Google account
      const success = await completeAuth();
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Failed to skip setup');
      }
    } catch (_error) {
      Alert.alert('Error', 'Please try again');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 px-8 py-12">
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center mb-8"
        >
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>

        {/* Header */}
        <View className="items-center mb-16">
          <Text className="text-2xl font-light text-white mb-2">
            Account Setup
          </Text>
          <Text className="text-gray-400 text-center text-sm">
            Connect your Google account for enhanced features
          </Text>
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-center">
          {/* Google Sign-In Button */}
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            className={`flex-row items-center justify-center rounded-lg py-4 px-6 mb-4 ${
              isLoading ? 'bg-gray-700' : 'bg-gray-800 border border-gray-700'
            }`}
          >
            {isLoading ? (
              <Text className="text-gray-300 text-base">
                Connecting...
              </Text>
            ) : (
              <>
                <View className="w-5 h-5 bg-red-500 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-xs font-bold">G</Text>
                </View>
                <Text className="text-white text-base font-medium">
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Skip Option */}
          <TouchableOpacity
            onPress={handleSkipForNow}
            disabled={isLoading}
            className="py-4"
          >
            <Text className="text-gray-400 text-center text-sm">
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Footer */}
        <View className="mt-auto">
          <Text className="text-gray-500 text-xs text-center leading-5">
            Your data is secure and encrypted.{'\n'}
            We respect your privacy and never share your information.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}