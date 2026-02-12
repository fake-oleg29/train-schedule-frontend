import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'text';
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses = 'px-4 py-2 border disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600',
    secondary: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-500 text-white border-red-500 hover:bg-red-600',
    text: 'bg-transparent border-transparent hover:underline',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

