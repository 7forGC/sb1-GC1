import React from 'react';
import { Plus } from 'lucide-react';
import { StoryItem } from './StoryItem';

export const StoryList: React.FC = () => {
  return (
    <div className="py-6 overflow-x-auto">
      <div className="flex gap-4 px-4">
        {/* Add Story Button */}
        <div className="flex flex-col items-center space-y-1">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-gray-200 overflow-hidden">
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-500" />
              </div>
            </div>
          </div>
          <span className="text-xs font-medium">Your Story</span>
        </div>

        {/* Story List */}
        {[...Array(10)].map((_, index) => (
          <StoryItem key={index} index={index} />
        ))}
      </div>
    </div>
  );
};

export default StoryList;