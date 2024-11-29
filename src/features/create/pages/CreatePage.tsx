import React, { useState } from 'react';
import { Image, Video, X } from 'lucide-react';
import Layout from '../../shared/components/Layout';

const CreatePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');

  return (
    <Layout>
      <div className="p-4">
        <div className="bg-white rounded-lg shadow p-4">
          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="flex flex-col items-center">
                <div className="flex space-x-4 mb-4">
                  <button className="p-3 bg-purple-100 rounded-full text-purple-600">
                    <Image className="w-6 h-6" />
                  </button>
                  <button className="p-3 bg-purple-100 rounded-full text-purple-600">
                    <Video className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 text-center">
                  Drag and drop photos and videos here<br />or click to upload
                </p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-full rounded-lg"
                />
                <button
                  onClick={() => setSelectedFile(null)}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
              />
              <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Share
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreatePage;