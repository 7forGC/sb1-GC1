import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import LoginPage from '../features/auth/pages/LoginPage';
import ChatPage from '../features/chat/pages/ChatPage';
import HomePage from '../features/home/pages/HomePage';
import SearchPage from '../features/search/pages/SearchPage';
import CreatePage from '../features/create/pages/CreatePage';
import ActivityPage from '../features/activity/pages/ActivityPage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import { StoreProvider } from '../core/context/StoreContext';
import PrivateRoute from './PrivateRoute';

const AppRoutes: React.FC = () => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute><CreatePage /></PrivateRoute>} />
          <Route path="/activity" element={<PrivateRoute><ActivityPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
};

export default observer(AppRoutes);