import React from 'react';

interface StoryItemProps {
  index: number;
}

export const StoryItem: React.FC<StoryItemProps> = ({ index }) => {
  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="p-[2px] rounded-full bg-gradient-to-tr from-purple-600 to-pink-600">
        <div className="p-[2px] rounded-full bg-white">
          <img
            src={`https://source.unsplash.com/random/100x100?face=${index}`}
            alt={`User ${index}`}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-white"
          />
        </div>
      </div>
      <span className="text-xs font-medium">User {index}</span>
    </div>
  );
};