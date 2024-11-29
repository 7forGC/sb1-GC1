import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Search, PlusSquare, Heart, User, MessageCircle, Bell } from 'lucide-react';
import Logo from '../../../components/Logo';
import LanguageSwitcher from '../../../components/LanguageSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b">
        <div className="max-w-screen-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <Logo className="w-8 h-8 text-purple-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              7 Global Connect
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <button 
              onClick={() => navigate('/activity')}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200" 
              title={t('header.notifications')}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={() => navigate('/chat')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200" 
              title={t('header.messages')}
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-md mx-auto pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t">
        <div className="max-w-screen-md mx-auto px-4 h-16 flex items-center justify-around">
          <NavButton
            icon={<Home className={`w-6 h-6 transition-colors duration-200 ${isActive('/') ? 'stroke-[2.5px]' : ''}`} />}
            label={t('navigation.home')}
            isActive={isActive('/')}
            onClick={() => navigate('/')}
          />
          <NavButton
            icon={<Search className={`w-6 h-6 transition-colors duration-200 ${isActive('/search') ? 'stroke-[2.5px]' : ''}`} />}
            label={t('navigation.search')}
            isActive={isActive('/search')}
            onClick={() => navigate('/search')}
          />
          <NavButton
            icon={
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                <PlusSquare className="w-6 h-6 text-white" />
              </div>
            }
            label={t('navigation.create')}
            isActive={isActive('/create')}
            onClick={() => navigate('/create')}
          />
          <NavButton
            icon={<Heart className={`w-6 h-6 transition-colors duration-200 ${isActive('/activity') ? 'stroke-[2.5px]' : ''}`} />}
            label={t('navigation.activity')}
            isActive={isActive('/activity')}
            onClick={() => navigate('/activity')}
          />
          <NavButton
            icon={<User className={`w-6 h-6 transition-colors duration-200 ${isActive('/profile') ? 'stroke-[2.5px]' : ''}`} />}
            label={t('navigation.profile')}
            isActive={isActive('/profile')}
            onClick={() => navigate('/profile')}
          />
        </div>
      </nav>
    </div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`p-2 flex flex-col items-center transition-colors duration-200 ${
      isActive ? 'text-black' : 'text-gray-500 hover:text-gray-900'
    }`}
  >
    {icon}
    <span className="text-xs mt-1 font-medium">{label}</span>
  </button>
);

export default Layout;