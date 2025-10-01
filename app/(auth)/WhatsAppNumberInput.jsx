import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

export default function WhatsAppNumberInput() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { savePhoneNumber } = useAuth();

  const validatePhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  };

  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})(\d*)$/);
      if (match) {
        return `${match[1]}-${match[2]}-${match[3]}${match[4] ? '-' + match[4] : ''}`;
      }
    }
    return cleaned;
  };

  const handlePhoneNumberChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const handleContinue = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      const cleanedNumber = phoneNumber.replace(/\D/g, '');
      const userData = await savePhoneNumber(cleanedNumber);
      
      if (userData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push({
          pathname: '/otp',
          params: { phoneNumber: cleanedNumber }
        });
      } else {
        Alert.alert('Error', 'Failed to save phone number');
      }
    } catch (_error) {
      Alert.alert('Error', 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <View className="flex-1 px-8 py-12">
          {/* Header */}
          <View className="items-center mb-16">
            <Text className="text-2xl font-light text-white mb-2">
              Welcome to Charto
            </Text>
            <Text className="text-gray-400 text-center text-sm">
              Enter your phone number to get started
            </Text>
          </View>

          {/* Phone Input */}
          <View className="mb-8">
            <Text className="text-gray-300 text-sm mb-4">Phone Number</Text>
            <View className="flex-row items-center bg-gray-800 rounded-lg border border-gray-700 px-4 py-4">
              <Text className="text-gray-300 mr-3">+1</Text>
              <TextInput
                className="flex-1 text-white text-base"
                placeholder="Enter phone number"
                placeholderTextColor="#6B7280"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                keyboardType="phone-pad"
                maxLength={15}
                autoFocus={true}
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={isLoading || !phoneNumber.trim()}
            className={`rounded-lg py-4 mb-8 ${
              isLoading || !phoneNumber.trim()
                ? 'bg-gray-700'
                : 'bg-blue-600'
            }`}
          >
            <Text className="text-white text-center font-medium">
              {isLoading ? 'Sending...' : 'Continue'}
            </Text>
          </TouchableOpacity>

          {/* Privacy */}
          <View className="mt-auto">
            <Text className="text-gray-500 text-xs text-center leading-5">
              Your data is encrypted and secure.{'\n'}
              By continuing, you accept our Terms & Privacy Policy.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}