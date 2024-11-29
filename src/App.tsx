import React, { useState } from 'react';
import Layout from './features/shared/components/Layout';
import StoryList from './components/StoryList';
import PostList from './components/PostList';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <StoryList />
      <PostList />
    </Layout>
  );
}

export default App;