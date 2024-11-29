import React from 'react';
import { Plus } from 'lucide-react';

const StoryList: React.FC = () => {
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
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center space-y-1">
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
        ))}
      </div>
    </div>
  );
};

export default StoryList;