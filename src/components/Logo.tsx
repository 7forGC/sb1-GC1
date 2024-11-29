import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      viewBox="0 0 800 800" 
      className={className}
      fill="currentColor"
    >
      <path d="M700 0H100C44.7715 0 0 44.7715 0 100V700C0 755.228 44.7715 800 100 800H700C755.228 800 800 755.228 800 700V100C800 44.7715 755.228 0 700 0ZM600 400C600 510.457 510.457 600 400 600C289.543 600 200 510.457 200 400C200 289.543 289.543 200 400 200C510.457 200 600 289.543 600 400Z" />
    </svg>
  );
};

export default Logo;