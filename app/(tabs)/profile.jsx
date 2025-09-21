import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const userPosts = [
    {
      id: 1,
      content: "Just had an amazing anonymous chat! Love how this app lets us connect without judgment 😊",
      timestamp: "2h ago",
      likes: 12,
      comments: 3
    },
    {
      id: 2,
      content: "The verification system here is so cool! Makes me feel more secure while staying anonymous.",
      timestamp: "1d ago",
      likes: 8,
      comments: 5
    },
    {
      id: 3,
      content: "Looking for people interested in tech and gaming. Drop me a message! 🎮💻",
      timestamp: "3d ago",
      likes: 15,
      comments: 7
    }
  ];

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Profile Header: Avatar, UID, Verification Tick, Settings Icon in One Line */}
      <View className="bg-gray-800 pt-12 pb-4 px-5 border-b border-gray-700">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            {/* Avatar */}
            <View className="w-16 h-16 bg-gray-700 rounded-full items-center justify-center mr-4">
              <Text className="text-3xl">👨‍💻</Text>
            </View>
            
            {/* UID and Verification */}
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-white mr-2">USR2024</Text>
              <Image 
                source={require('../../assets/image.png')} 
                className="w-5 h-5"
                resizeMode="contain"
              />
            </View>
          </View>
          
          {/* Settings Dropdown */}
          <View className="relative">
            <TouchableOpacity 
              onPress={() => setDropdownVisible(!dropdownVisible)}
              className="bg-gray-700 p-3 rounded-full"
            >
              <Text className="text-white text-lg">⚙️</Text>
            </TouchableOpacity>
            
            {dropdownVisible && (
              <View className="absolute top-12 right-0 bg-gray-700 rounded-lg border border-gray-600 z-10 w-48">
                <TouchableOpacity className="px-4 py-3 border-b border-gray-600">
                  <Text className="text-white">✏️ Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-4 py-3 border-b border-gray-600">
                  <Text className="text-white">🔔 Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-4 py-3 border-b border-gray-600">
                  <Text className="text-white">🔒 Privacy Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-4 py-3 border-b border-gray-600">
                  <Text className="text-white">❓ Help & Support</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-4 py-3">
                  <Text className="text-red-400">🚪 Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="p-5">
        {/* User Bio */}
        <View className="mb-6">
          <Text className="text-white text-base mb-3">
            Anonymous tech enthusiast who loves connecting with like-minded people. Here to share thoughts and have meaningful conversations! 💭✨
          </Text>
        </View>

        {/* User Interests & Tags */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">Interests & Tags</Text>
          <View className="flex-row flex-wrap">
            {['Technology', 'Gaming', 'Music', 'Travel', 'Photography', 'Books', 'Movies', 'Coding'].map((tag, index) => (
              <View key={index} className="bg-blue-600 px-3 py-2 rounded-full mr-2 mb-2">
                <Text className="text-white text-sm font-medium">{tag}</Text>
              </View>
            ))}
          </View>
        </View>



        {/* Text-Based Posts Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-white">My Posts</Text>
            <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
              <Text className="text-white font-medium">+ Create Post</Text>
            </TouchableOpacity>
          </View>
          
          {userPosts.map((post) => (
            <View key={post.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-3">
              {/* Post Header */}
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center mr-3">
                  <Text className="text-sm">👨‍💻</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-white font-semibold mr-2">USR2024</Text>
                  <Image 
                    source={require('../../assets/image.png')}
                    className="w-3 h-3 mr-2"
                    resizeMode="contain"
                  />
                  <Text className="text-gray-400 text-sm">{post.timestamp}</Text>
                </View>
              </View>
              
              {/* Post Content */}
              <Text className="text-white text-base mb-3">{post.content}</Text>
              
              {/* Post Actions */}
              <View className="flex-row items-center justify-between border-t border-gray-700 pt-3">
                <TouchableOpacity className="flex-row items-center">
                  <Text className="text-gray-400 mr-1">❤️</Text>
                  <Text className="text-gray-400 text-sm">{post.likes} likes</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                  <Text className="text-gray-400 mr-1">💬</Text>
                  <Text className="text-gray-400 text-sm">{post.comments} comments</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text className="text-gray-400">📤 Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

      </View>
    </ScrollView>
  );
}