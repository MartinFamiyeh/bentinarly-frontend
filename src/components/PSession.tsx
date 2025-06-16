import React from 'react';
import Button from './Button';

const PSession: React.FC = () => {
  return (
    <div className="w-full bg-gray-100 py-8 text-center px-4 sm:px-6 lg:px-8 dark:bg-gray-800 dark:text-white">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 dark:text-white">Get Paid To Participate</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8 dark:text-gray-300 max-w-xl">Your opinions are valuable—and now, they can earn you rewards!"</p>
        <Button onClick={() => console.log('Get Started Now clicked')}>
          Get Started Now
        </Button>
      </div>
    </div>
  );
};

export default PSession;