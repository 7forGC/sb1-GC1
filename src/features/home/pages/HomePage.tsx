import React from 'react';
import Layout from '../../shared/components/Layout';
import StoryList from '../components/StoryList';
import PostList from '../components/PostList';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <StoryList />
      <PostList />
    </Layout>
  );
};

export default HomePage;