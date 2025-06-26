import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-orange-600 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button; 