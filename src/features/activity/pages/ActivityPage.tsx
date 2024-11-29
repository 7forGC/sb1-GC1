import React from 'react';
import Layout from '../../shared/components/Layout';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';

const ActivityPage: React.FC = () => {
  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <ActivityItem key={index} index={index} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

const ActivityItem: React.FC<{ index: number }> = ({ index }) => {
  const types = ['like', 'comment', 'follow'];
  const type = types[index % 3];

  const getIcon = () => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <img
        src={`https://source.unsplash.com/random/40x40?face=${index}`}
        alt="User avatar"
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold">User {index}</span>{' '}
          {getMessage()}
        </p>
        <p className="text-xs text-gray-500">2 hours ago</p>
      </div>
      <div className="p-2 bg-gray-100 rounded-full">
        {getIcon()}
      </div>
    </div>
  );
};

export default ActivityPage;