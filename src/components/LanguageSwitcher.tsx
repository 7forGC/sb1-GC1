import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hr', name: 'Hrvatski' },
    { code: 'de', name: 'Deutsch' }
  ];

  return (
    <div className="relative group">
      <button className="p-2 hover:bg-gray-100 rounded-full">
        <Globe className="w-6 h-6" />
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
              i18n.language === lang.code ? 'font-semibold bg-gray-50' : ''
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSwitcher;