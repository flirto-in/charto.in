import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchScreen() {
  const allUsers = [
    { id: 1, uid: 'USR123', avatar: '👨', isOnline: true, isVerified: true, tags: ['Music', 'Travel', 'Tech'] },
    { id: 2, uid: 'USR456', avatar: '👩', isOnline: false, isVerified: false, tags: ['Art', 'Books', 'Coffee'] },
    { id: 3, uid: 'USR789', avatar: '👤', isOnline: true, isVerified: true, tags: ['Gaming', 'Movies', 'Food'] },
    { id: 4, uid: 'USR321', avatar: '👨‍💻', isOnline: false, isVerified: false, tags: ['Coding', 'Music', 'Sports'] },
    { id: 5, uid: 'USR654', avatar: '👩‍🎨', isOnline: true, isVerified: true, tags: ['Design', 'Fashion', 'Nature'] },
    { id: 6, uid: 'USR987', avatar: '👨‍🚀', isOnline: false, isVerified: false, tags: ['Space', 'Science', 'Tech'] },
    { id: 7, uid: 'USR147', avatar: '👩‍🏫', isOnline: true, isVerified: true, tags: ['Teaching', 'Books', 'Kids'] },
    { id: 8, uid: 'USR258', avatar: '👨‍🎨', isOnline: false, isVerified: false, tags: ['Art', 'Culture', 'History'] },
    { id: 9, uid: 'USR369', avatar: '👩‍💼', isOnline: true, isVerified: false, tags: ['Business', 'Finance', 'Travel'] },
    { id: 10, uid: 'USR741', avatar: '👨‍🔬', isOnline: false, isVerified: true, tags: ['Science', 'Research', 'Innovation'] },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Header with Search Bar */}
      <View className="bg-gray-800 pt-12 pb-4 px-5 border-b border-gray-700">
        <Text className="text-2xl font-bold text-white mb-4">Search Users</Text>
        
        {/* Search Bar */}
        <View className="bg-gray-700 rounded-xl px-4 py-3 flex-row items-center">
          <Text className="text-gray-400 mr-3">🔍</Text>
          <TextInput
            placeholder="Search by UID, tags, or interests..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-white text-base"
          />
        </View>
      </View>

      <View className="p-5">
        {/* All Users */}
        <View>
          <Text className="text-lg font-semibold text-white mb-3">All Users ({allUsers.length})</Text>
          
          {allUsers.map((user) => (
            <View key={user.id} className="bg-gray-800 rounded-lg p-4 mb-3 border border-gray-700">
              <View className="flex-row items-center justify-between">
                {/* User Info */}
                <View className="flex-row items-center flex-1">
                  <View className="relative">
                    <Text className="text-3xl">{user.avatar}</Text>
                    {user.isOnline ? (
                      <View className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                    ) : (
                      <View className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-500 rounded-full border-2 border-gray-800" />
                    )}
                  </View>
                  
                  <View className="ml-3 flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-white font-semibold text-base">{user.uid}</Text>
                      {user.isVerified && (
                        <Image 
                          source={require('../../assets/image.png')} 
                          className="w-4 h-4 ml-2"
                          resizeMode="contain"
                        />
                      )}
                    </View>
                    
                    {/* Tags */}
                    <View className="flex-row mt-1">
                      {user.tags.slice(0, 3).map((tag, index) => (
                        <View key={index} className="bg-gray-700 px-2 py-1 rounded-full mr-2">
                          <Text className="text-gray-300 text-xs">{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Chat Button */}
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