import React from 'react';

const LoadingSpinner = ({ size = 'large', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className={`flex justify-center items-center py-12 ${className}`}>
      <div className={`animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 ${sizeClasses[size]}`}></div>
      <span className="ml-3 text-gray-600 dark:text-gray-300">Loading cryptocurrencies...</span>
    </div>
  );
};

export default LoadingSpinner;
