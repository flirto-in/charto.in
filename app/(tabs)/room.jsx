import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function RoomScreen() {
  const chatRooms = [
    { 
      id: 1, 
      name: 'General Chat', 
      members: 324, 
      active: true, 
      emoji: '💬',
      lastMessage: 'USR789: Hey everyone! 👋',
      unreadCount: 12,
      category: 'General'
    },
    { 
      id: 2, 
      name: 'Music Lovers', 
      members: 156, 
      active: true, 
      emoji: '🎵',
      lastMessage: 'USR456: What\'s your favorite song?',
      unreadCount: 5,
      category: 'Music'
    },
    { 
      id: 3, 
      name: 'Tech Talk', 
      members: 89, 
      active: true, 
      emoji: '💻',
      lastMessage: 'USR123: Anyone into AI development?',
      unreadCount: 3,
      category: 'Technology'
    },
    { 
      id: 4, 
      name: 'Gaming Zone', 
      members: 234, 
      active: false, 
      emoji: '🎮',
      lastMessage: 'USR321: Let\'s play some games!',
      unreadCount: 0,
      category: 'Gaming'
    },
    { 
      id: 5, 
      name: 'Art & Design', 
      members: 67, 
      active: true, 
      emoji: '🎨',
      lastMessage: 'USR654: Check out my latest artwork',
      unreadCount: 8,
      category: 'Art'
    },
    { 
      id: 6, 
      name: 'Random Chat', 
      members: 445, 
      active: true, 
      emoji: '🎲',
      lastMessage: 'USR987: Anyone want to chat?',
      unreadCount: 15,
      category: 'Random'
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="bg-gray-800 pt-12 pb-4 px-5 border-b border-gray-700">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-white">Chat Rooms</Text>
          <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
            <Text className="text-white font-medium">+ Create Room</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-400">Join group conversations anonymously</Text>
      </View>

      <View className="p-5">
        {/* Active Chat Rooms */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">Popular Rooms</Text>
          
          {chatRooms.map((room) => (
            <TouchableOpacity 
              key={room.id} 
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-3"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  {/* Room Emoji/Avatar */}
                  <View className="w-12 h-12 bg-gray-700 rounded-full items-center justify-center mr-3">
                    <Text className="text-2xl">{room.emoji}</Text>
                  </View>
                  
                  {/* Room Info */}
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-white font-semibold text-base">{room.name}</Text>
                      {room.unreadCount > 0 && (
                        <View className="bg-red-500 px-2 py-1 rounded-full">
                          <Text className="text-white text-xs font-bold">{room.unreadCount}</Text>
                        </View>
                      )}
                    </View>
                    
                    <Text className="text-gray-400 text-sm mb-1" numberOfLines={1}>
                      {room.lastMessage}
                    </Text>
                    
                    <View className="flex-row items-center">
                      <View className={`w-2 h-2 rounded-full mr-2 ${room.active ? 'bg-green-500' : 'bg-gray-500'}`} />
                      <Text className="text-gray-500 text-xs">
                        {room.members} members • {room.active ? 'Active' : 'Quiet'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        

      </View>
    </ScrollView>
  );
}