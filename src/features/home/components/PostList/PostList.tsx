import React from 'react';
import { PostItem } from './PostItem';
import { usePostActions } from '../../hooks/usePostActions';

export const PostList: React.FC = () => {
  const { likedPosts, toggleLike } = usePostActions();

  return (
    <div className="space-y-6">
      {[...Array(5)].map((_, index) => (
        <PostItem
          key={index}
          index={index}
          isLiked={likedPosts.has(index)}
          onLike={() => toggleLike(index)}
        />
      ))}
    </div>
  );
};

export default PostList;