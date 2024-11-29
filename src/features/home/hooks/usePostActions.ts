import { useState } from 'react';

export const usePostActions = () => {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return {
    likedPosts,
    toggleLike
  };
};