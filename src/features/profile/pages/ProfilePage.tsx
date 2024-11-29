import React from 'react';
import { Settings, Grid, Bookmark, Heart } from 'lucide-react';
import Layout from '../../shared/components/Layout';
import { useAuth } from '../../auth/hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatar || `https://source.unsplash.com/random/80x80?face=1`}
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="text-xl font-semibold">{user?.username || 'Username'}</h2>
              <p className="text-gray-600">Bio goes here</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div>
            <div className="font-semibold">123</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div>
            <div className="font-semibold">1.4K</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div>
            <div className="font-semibold">789</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
        </div>

        <div className="border-t">
          <div className="flex justify-around py-2">
            <button className="p-4 border-b-2 border-black">
              <Grid className="w-6 h-6" />
            </button>
            <button className="p-4">
              <Bookmark className="w-6 h-6" />
            </button>
            <button className="p-4">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="aspect-square">
                <img
                  src={`https://source.unsplash.com/random/300x300?nature=${index}`}
                  alt={`Post ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;