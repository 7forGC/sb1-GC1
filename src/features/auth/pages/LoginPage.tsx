import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import Logo from '../../../components/Logo';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <Logo className="w-16 h-16 text-purple-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            7 Global Connect
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin
              ? 'Sign in to continue to 7 Global Connect'
              : 'Join 7 Global Connect to connect with friends'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isLogin ? <LoginForm /> : <RegisterForm />}
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin ? 'New to 7 Global Connect?' : 'Already have an account?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {isLogin ? 'Create an account' : 'Sign in to existing account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(LoginPage);