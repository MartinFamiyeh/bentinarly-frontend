import React from 'react';
import Button from './button';

const PSession: React.FC = () => {
  return (
    <div
      className="w-full min-h-[300px] flex items-center justify-center px-4 py-16 text-center bg-cover bg-center bg-no-repeat dark:bg-none"
      style={{
        backgroundImage: `url('/PsectionLight.png')`,
      }}
    >
      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none dark:block hidden" style={{ backgroundImage: `url('/PsectionDark.png')` }} />
      <div className="relative flex flex-col items-center z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 dark:text-white">Get Paid To Participate</h1>
        <p className="text-base sm:text-lg text-gray-600 font-bold mb-8 dark:text-gray-300 max-w-xl whitespace-nowrap">Your opinions are valuable—and now, they can earn you rewards!</p>
        <Button onClick={() => console.log('Get Started Now clicked')}>
          Get Started Now
        </Button>
      </div>
    </div>
  );
};

export default PSession;