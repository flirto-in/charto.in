import { router } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';


export default function AllScreen() {

  const onlineUsers = [
    { id: 1, uid: 'USR123', avatar: '👨', isOnline: true, isVerified: true, tags: ['Music', 'Travel', 'Tech'] },
    { id: 2, uid: 'USR456', avatar: '👩', isOnline: true, isVerified: false, tags: ['Art', 'Books', 'Coffee'] },
    { id: 3, uid: 'USR789', avatar: '👤', isOnline: true, isVerified: true, tags: ['Gaming', 'Movies', 'Food'] },
    { id: 4, uid: 'USR321', avatar: '👨‍💻', isOnline: true, isVerified: false, tags: ['Coding', 'Music', 'Sports'] },
    { id: 5, uid: 'USR654', avatar: '👩‍🎨', isOnline: true, isVerified: true, tags: ['Design', 'Fashion', 'Nature'] },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="bg-gray-800 pt-12 pb-4 px-5 border-b border-gray-700">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-white">Charto</Text>
          <TouchableOpacity className="w-10 h-10 bg-gray-700 rounded-full items-center justify-center">
            <Text className="text-xl">🔔</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-400">Anonymous Chat - Connect with anyone</Text>
      </View>

      {/* Online Count */}
      <View className="px-5 py-3 bg-gray-800 border-b border-gray-700">
        <Text className="text-green-400 font-semibold">
          🟢 {onlineUsers.length} users online
        </Text>
      </View>

      {/* Quick Chat Access */}
      <View className="p-5">
        <Text className="text-lg font-semibold text-white mb-4">Quick Chat Access</Text>
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => router.push('/group-chat')}
            className="bg-green-600 rounded-xl p-4 items-center"
          >
            <Text className="text-3xl mb-2">👥</Text>
            <Text className="text-white font-semibold">Group Chats</Text>
            <Text className="text-green-200 text-sm text-center">Join topic-based chat rooms</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/WhatsAppNumberInput')}
            className="bg-blue-600 rounded-xl p-4 items-center">
            <Text className="text-white font-semibold">Number</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/otp')}
            className="bg-blue-600 rounded-xl p-4 items-center">
            <Text className="text-white font-semibold">OTPVerification</Text>
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={() => getUserData()}
            className="bg-blue-600 rounded-xl p-4 items-center">
            <Text className="text-white font-semibold">GoogleAuth</Text>
          </TouchableOpacity>

        </View>
      </View>


      <View className="p-5">
        {/* People Online */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">People Online</Text>

          {onlineUsers.map((user) => (
            <View key={user.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="relative mr-3">
                    <Text className="text-2xl">{user.avatar}</Text>
                    {user.isOnline && (
                      <View className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                    )}
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-white font-semibold">{user.uid}</Text>
                      {user.isVerified && (
                        <Image
                          source={require('../../assets/image.png')}
                          className="w-4 h-4 ml-2"
                          resizeMode="contain"
                        />
                      )}
                    </View>

                    <View className="flex-row mt-1">
                      {user.tags.slice(0, 2).map((tag, index) => (
                        <View key={index} className="bg-gray-700 px-2 py-1 rounded-full mr-2">
                          <Text className="text-gray-300 text-xs">{tag}</Text>
                        </View>
                      ))}
                      {user.tags.length > 2 && (
                        <Text className="text-gray-500 text-xs self-center">+{user.tags.length - 2}</Text>
                      )}
                    </View>
                  </View>
                </View>

                <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-full">
                  <Text className="text-white font-semibold text-sm">Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

      </View>
    </ScrollView>
  );
}