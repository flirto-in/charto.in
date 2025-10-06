import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';


const PostsList = ({
  posts = [],
  currentUserId,
  onLike,
  showEmptyFallback = true,
}) => {
  const [localPosts, setLocalPosts] = useState(posts);

  // Sync when parent posts change
  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);
//   console.log('====================================');
//   console.log(localPosts);
//   console.log('====================================');

  const handleLike = async (item, index) => {
    // optimistic update
    setLocalPosts(prev => {
      const clone = [...prev];
      const p = { ...clone[index] };
      if (Array.isArray(p.likes)) {
        // store placeholder like id
        p.likes = [...p.likes, '__local__'];
      } else {
        p.likes = (p.likes || 0) + 1;
      }
      clone[index] = p;
      return clone;
    });
    try {
      if (onLike) await Promise.resolve(onLike(item, index));
  } catch (_e) {
      // revert on error
      setLocalPosts(prev => {
        const clone = [...prev];
        const p = { ...clone[index] };
        if (Array.isArray(p.likes)) {
          p.likes = p.likes.filter(l => l !== '__local__');
        } else {
          p.likes = Math.max((p.likes || 1) - 1, 0);
        }
        clone[index] = p;
        return clone;
      });
    }
  };

  const renderItem = ({ item, index }) => {
    console.log('====================================');
    console.log(item);
    console.log('====================================');
    const id = item?.createdBy?.U_Id|| 'USER';
    const content = item.content || item.description || '...';
    const isOwner = currentUserId && (id === currentUserId || item.userId === currentUserId);
    const likeCount = Array.isArray(item.likes) ? item.likes.length : (item.likes || 0);
    return (
      <View className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-4 flex-row">
        <View className="flex-1 pr-3">
          <Text className="text-white font-semibold text-sm mb-1">{id}{isOwner ? ' (Me)' : ''}</Text>
          <Text className="text-gray-300 text-sm leading-5" numberOfLines={6}>{content}</Text>
          <View className="flex-row mt-3">
            <Text className="text-gray-500 text-xs">❤️ {likeCount}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleLike(item, index)}
          className="w-10 h-10 bg-purple-600 rounded-full items-center justify-center self-start"
          activeOpacity={0.8}
        >
          <Text className="text-white text-base">👍</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!localPosts.length && showEmptyFallback) {
    return (
      <View className="bg-gray-800 p-4 rounded-xl border border-gray-700">
        <Text className="text-white font-medium mb-2">No posts yet</Text>
        <Text className="text-gray-400 text-sm">Start the conversation by creating your first post.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={localPosts}
      keyExtractor={(item, i) => String(item.id || item._id || i)}
      renderItem={renderItem}
      scrollEnabled={false}
    />
  );
};

export default PostsList;
