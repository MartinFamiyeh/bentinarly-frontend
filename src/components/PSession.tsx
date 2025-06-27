import React from 'react';
import Button from './button';

const PSession: React.FC = () => {
  return (
    <div
      className="w-full min-h-[220px] flex items-center justify-center px-2 py-10 sm:px-4 sm:py-16 text-center bg-cover bg-center bg-no-repeat bg-[url('/PsectionLight.png')] dark:bg-[url('/PsectionDark.png')]"
    >
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 dark:text-white leading-tight">Get Paid To Participate</h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 font-bold mb-6 sm:mb-8 dark:text-gray-300 max-w-xs sm:max-w-xl mx-auto">Your opinions are valuable—and now, they can earn you rewards!</p>
        <Button onClick={() => console.log('Get Started Now clicked')} className="w-full sm:w-auto">
          Get Started Now
        </Button>
      </div>
    </div>
  );
};

export default PSession;