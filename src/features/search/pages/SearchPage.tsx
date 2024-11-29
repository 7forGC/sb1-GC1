import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Layout from '../../shared/components/Layout';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <Layout>
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
        <div className="mt-4">
          {/* Search results will be displayed here */}
          <p className="text-gray-500 text-center">Enter a search term to find posts, users, or tags</p>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;