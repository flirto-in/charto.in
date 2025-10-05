import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ProfileUpdate from '../../components/ProfileUpdate';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { user, logout, makeAuthenticatedRequest, updateLocalUser } = useAuth();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const displayUser = profileData || user;
  const [editProfileVisible, setEditProfileVisible] = useState(false);

  // Extract primitive userId so dependency changes only when ID string changes
  const userId = user?._id;

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      console.log('[Profile] Fetching profile for user ID:', userId);
      const response = await makeAuthenticatedRequest(`/users/${userId}`);

      if (response.success && response.data?.user) {
        const userData = { ...response.data.user };
        if (!userData.interests || userData.interests.length === 0) {
          userData.interests = ['tech', 'music', 'travel', 'coding', 'art', 'sports', 'photography', 'gaming'];
        }
        setProfileData(userData);
        // Only update context user if something actually changed (prevents fetch loops)
        if (user && JSON.stringify({
          description: user.description,
          tags: user.tags,
          interests: user.interests,
        }) !== JSON.stringify({
          description: userData.description,
          tags: userData.tags,
          interests: userData.interests,
        })) {
          updateLocalUser(userData);
        }
      } else {
        console.log('[Profile] Profile fetch failed:', response);
      }
    } catch (error) {
      console.error('[Profile] Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, makeAuthenticatedRequest, updateLocalUser, user]);

  useEffect(() => {
    fetchProfile();
  }, [userId, fetchProfile]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  const handleProfileUpdateSuccess = (updatedUserData) => {
    // Update the profile data with the new information
    if (updatedUserData?.user) {
      setProfileData(updatedUserData.user);
      // persist locally so other screens get updated immediately
      updateLocalUser(updatedUserData.user);
    }
    // Refresh the profile to get latest data from server
    fetchProfile();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout }
      ]
    );
  };

  const renderDropdownItem = (icon, text, onPress, isLast = false) => (
    <TouchableOpacity
      key={text}
      onPress={onPress}
      className={`flex-row items-center px-4 py-3 ${!isLast ? 'border-b border-gray-600' : ''}`}
    >
      <Text className="text-white text-base mr-3">{icon}</Text>
      <Text className="text-white text-sm font-medium">{text}</Text>
    </TouchableOpacity>
  );

  // Loading state while user data is being fetched
  if (!user && !profileData && !loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Static Banner Section */}
        <View className="relative">
          {/* Header Section with Profile Info */}
          <View className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 pt-12 pb-6">
            
            {/* Static Dark Banner Overlay - covers top half */}
            <View className="absolute top-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-b-4   border-black/50" style={{ height: 120 }}>
              {/* Geometric pattern overlay */}
              <View className="absolute inset-0 overflow-hidden">
                {/* Diagonal lines pattern */}
                <View className="absolute -top-10 -left-10 w-40 h-40 border-2 border-purple-500/20 rounded-full" />
                <View className="absolute -top-5 -right-15 w-32 h-32 border border-pink-500/20 rounded-full" />
                <View className="absolute top-10 left-1/3 w-24 h-24 border border-blue-500/15 rounded-full" />
                
                {/* Floating dots pattern */}
                <View className="absolute top-8 left-8 w-2 h-2 bg-purple-400/30 rounded-full" />
                <View className="absolute top-12 right-12 w-1.5 h-1.5 bg-pink-400/30 rounded-full" />
                <View className="absolute top-16 left-1/2 w-1 h-1 bg-blue-400/30 rounded-full" />
                <View className="absolute top-6 left-1/4 w-1.5 h-1.5 bg-purple-300/20 rounded-full" />
                <View className="absolute top-20 right-1/3 w-2 h-2 bg-pink-300/20 rounded-full" />
                
                {/* Subtle gradient bars */}
                <View className="absolute top-4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
                <View className="absolute bottom-4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent" />
              </View>
              
              {/* Central design element */}
              <View className="flex-1 items-center justify-center">
                <View className="relative">
                  {/* Main hexagon shape */}
                  <View className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-pink-600/30 transform rotate-45 rounded-lg border border-white/10" />
                  
                  {/* Inner hexagon */}
                  <View className="absolute top-2 left-2 w-12 h-12 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 transform rotate-45 rounded-lg" />
                  
                  {/* Center dot */}
                  <View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white/40 rounded-full" />
                </View>
              </View>
              
              {/* Settings Icon positioned in banner */}
              <View className="absolute top-3 right-4">
                <TouchableOpacity 
                  onPress={() => setSettingsVisible(!settingsVisible)}
                  className="w-10 h-10 bg-white/10 rounded-full items-center justify-center border border-white/20"
                >
                  <Text className="text-white text-lg">⚙️</Text>
                </TouchableOpacity>
              </View>
            </View>

          {/* Profile Info Container */}
          <View className="items-center mt-5">
            {/* Avatar */}
            <View className="w-24 h-24 bg-gray-800/95 rounded-full items-center justify-center mb-4 border-4 ">
              <Text className="text-white text-4xl font-bold animate-bounce">
                {/* {displayUser?.U_Id?.charAt(2) || 'U'} */}
                👹
              </Text>
            </View>
            
            {/* User ID with verification */}
            <View className="flex-row items-center mb-4">
              <Text className="text-white text-xl font-bold mr-2">
                {displayUser?.U_Id || 'USR2024'}
              </Text>
              {displayUser?.isVerified && (
                <View className="w-6 h-6 rounded-full items-center justify-center">
                  <Image
                    source={require('../../assets/image.png')}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>
              )}
              <TouchableOpacity 
                onPress={() => setEditProfileVisible(true)}
                className="ml-2 w-6 h-6 bg-purple-600 rounded-full items-center justify-center"
              >
                <Text className="text-white text-xs">✏️</Text>
              </TouchableOpacity>
            </View>


            {/* Tags */}
            <View className="flex-row flex-wrap justify-center">
              {(displayUser?.tags?.length > 0 ? 
                displayUser.tags.slice(0, 4) : 
                ['tech', 'music', 'travel', 'creative']
              ).map((tag, index) => (
                <View key={index} className="bg-white/20 px-3 py-1 rounded-full mx-1 mb-2">
                  <Text className="text-white text-sm font-medium">{tag}</Text>
                </View>
              ))}
            </View>
          </View>

            {/* Settings Dropdown - positioned relative to banner */}
            {settingsVisible && (
              <View className="absolute top-14 right-4 bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 z-20 min-w-[180px]">
                {renderDropdownItem('✏️', 'Edit Profile', () => {
                  setSettingsVisible(false);
                  setEditProfileVisible(true);
                })}
                {renderDropdownItem('🔒', 'Privacy Settings', () => {
                  setSettingsVisible(false);
                })}
                {renderDropdownItem('📱', 'Account Settings', () => {
                  setSettingsVisible(false);
                })}
                {renderDropdownItem('❓', 'Help & Support', () => {
                  setSettingsVisible(false);
                })}
                {renderDropdownItem('🚪', 'Logout', () => {
                  setSettingsVisible(false);
                  handleLogout();
                }, true)}
              </View>
            )}
        </View>

        {/* Content Section */}
        <View className="px-6 ">
          {/* Bio Section */}
          <View className="mb-4">
            <View className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <Text className="text-white font-bold text-lg mb-2">Bio</Text>
              <Text className="text-gray-300 text-sm leading-5">
                {displayUser?.description || 'No bio available. Add a bio to tell others about yourself!'}
              </Text>
            </View>
          </View>

          {/* Interests Section */}
          <View className="mb-4">
            <View className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <Text className="text-white font-bold text-lg mb-3">Interests</Text>
              <View className="flex-row flex-wrap">
                {(displayUser?.interests?.length > 0 ? 
                  displayUser.interests : 
                  ['tech', 'music', 'travel', 'coding', 'art', 'sports', 'photography', 'gaming']
                ).map((interest, index) => (
                  <View key={index} className="bg-purple-600 px-3 py-1 rounded-full mr-2 mb-2">
                    <Text className="text-white text-xs font-medium">{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Activity Stats Section */}
          <View className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <Text className="text-white font-bold text-xl mb-4">Activity Stats</Text>

            {/* Stats Row */}
            <View className="flex-row justify-around items-center py-2">
              <View className="items-center">
                <Text className="text-white font-bold text-2xl">
                  {displayUser?.posts?.length || 0}
                </Text>
                <Text className="text-gray-400 text-sm">Posts</Text>
              </View>
              
              <View className="w-px h-8 bg-gray-700" />
              
              <View className="items-center">
                <Text className="text-white font-bold text-2xl">
                  {displayUser?.rooms?.length || 0}
                </Text>
                <Text className="text-gray-400 text-sm">Rooms</Text>
              </View>
              
              <View className="w-px h-8 bg-gray-700" />
              
              <View className="items-center">
                <Text className="text-white font-bold text-2xl">
                  {(displayUser?.primaryChat?.length || 5) + (displayUser?.secondaryChat?.length || 2)}
                </Text>
                <Text className="text-gray-400 text-sm">Likes</Text>
              </View>
            </View>
          </View>

          {/* Posts Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white font-bold text-xl">Posts</Text>
              <TouchableOpacity className="bg-purple-600 px-4 py-2 rounded-full">
                <Text className="text-white font-semibold">Create Post</Text>
              </TouchableOpacity>
            </View>

            {/* Posts List */}
            {(displayUser?.posts?.length > 0) ? (
              <View className="space-y-4">
                {displayUser.posts.map((post, index) => (
                  <View key={index} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <Text className="text-white font-medium mb-2">{post.title || `Post ${index + 1}`}</Text>
                    <Text className="text-gray-300 text-sm">{post.content || post.description || 'Post content...'}</Text>
                    <View className="flex-row items-center mt-3">
                      <Text className="text-gray-400 text-xs mr-4">❤️ {post.likes || 0}</Text>
                      <Text className="text-gray-400 text-xs mr-4">💬 {post.comments || 0}</Text>
                      <Text className="text-gray-400 text-xs">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              // Default posts when user has no posts
              <View className="space-y-4">
                <View className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <Text className="text-white font-medium mb-2">Welcome to the community! 🎉</Text>
                  <Text className="text-gray-300 text-sm">This is where your posts will appear. Share your thoughts, experiences, or anything that interests you!</Text>
                  <View className="flex-row items-center mt-3">
                    <Text className="text-gray-400 text-xs mr-4">❤️ 12</Text>
                    <Text className="text-gray-400 text-xs mr-4">💬 3</Text>
                    <Text className="text-gray-400 text-xs">Sample post</Text>
                  </View>
                </View>

                <View className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <Text className="text-white font-medium mb-2">Getting started with posting 📝</Text>
                  <Text className="text-gray-300 text-sm">Tips: Be authentic, engage with others, and share content that adds value to the community.</Text>
                  <View className="flex-row items-center mt-3">
                    <Text className="text-gray-400 text-xs mr-4">❤️ 8</Text>
                    <Text className="text-gray-400 text-xs mr-4">💬 5</Text>
                    <Text className="text-gray-400 text-xs">Sample post</Text>
                  </View>
                </View>

                <View className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <Text className="text-white font-medium mb-2">Connect and discover 🌟</Text>
                  <Text className="text-gray-300 text-sm">Explore different topics, join conversations, and build meaningful connections with like-minded people.</Text>
                  <View className="flex-row items-center mt-3">
                    <Text className="text-gray-400 text-xs mr-4">❤️ 15</Text>
                    <Text className="text-gray-400 text-xs mr-4">💬 7</Text>
                    <Text className="text-gray-400 text-xs">Sample post</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {loading && (
          <View className="items-center py-8">
            <Text className="text-white">Loading...</Text>
          </View>
        )}
        </View>
      </ScrollView>

      {/* Profile Update Modal */}
      <ProfileUpdate
        visible={editProfileVisible}
        initialData={displayUser}
        onClose={() => setEditProfileVisible(false)}
        onSuccess={handleProfileUpdateSuccess}
      />
    </View>
  );
}