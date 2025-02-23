import React from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../features/auth/hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

export default observer(PrivateRoute);