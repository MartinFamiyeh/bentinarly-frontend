import React from "react";

const Team: React.FC = () => {
  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center flex-col gap-4 mb-10">
        <div className="rounded-[32px] py-3 px-4 bg-[#FFB59436] text-center">
          <p className="text-sm font-medium leading-[100%] tracking-[0%] text-[#FE5102] dark:text-[#FE5102]">
            Our Team
          </p>
        </div>
        <p className="font-bold text-[24px] lg:text-[40px] text-center md:text-left leading-[100%] tracking-[0%]">
          The Faces & Minds Behind Bertinarly
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
        <div className="w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)] h-[204px] lg:h-[300px] rounded-md relative group overflow-hidden">
          <div className="w-full h-[204px] lg:h-[300px] bg-cover bg-top bg-no-repeat bg-[url('assets/images/elizabeth.jpg')] rounded-md"></div>
        </div>
        <div className="w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)] h-[204px] lg:h-[300px] rounded-md relative group overflow-hidden">
          <div className="w-full h-[204px] lg:h-[300px] bg-cover bg-center bg-no-repeat bg-[url('assets/images/martin.jpeg')] rounded-md"></div>
        </div>
        <div className="w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)] h-[204px] lg:h-[300px] rounded-md relative group overflow-hidden">
          <div className="w-full h-[204px] lg:h-[300px] bg-cover bg-center bg-no-repeat bg-[url('assets/images/odoi.jpg')] rounded-md"></div>
        </div>
        <div className="w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)] h-[204px] lg:h-[300px] rounded-md relative group overflow-hidden">
          <div className="w-full h-[204px] lg:h-[300px] bg-cover bg-center bg-no-repeat bg-[url('assets/images/nai.jpg')] rounded-md"></div>
        </div>
        <div className="w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)] h-[204px] lg:h-[300px] rounded-md relative group overflow-hidden">
          <div className="w-full h-[204px] lg:h-[300px] bg-cover bg-top bg-no-repeat bg-[url('assets/images/armah.jpg')] rounded-md"></div>
        </div>
        <div className="w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)] h-[204px] lg:h-[300px] rounded-md relative group overflow-hidden">
          <div className="w-full h-[204px] lg:h-[300px] bg-cover bg-center bg-no-repeat bg-[url('assets/images/daniel.jpg')] rounded-md"></div>
        </div>
        <div className="w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)] h-[204px] lg:h-[300px] rounded-md relative group overflow-hidden">
          <div className="w-full h-[204px] lg:h-[300px] bg-cover bg-center bg-no-repeat bg-[url('assets/images/elizabeth.jpg')] rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default Team;
