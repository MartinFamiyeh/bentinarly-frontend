import React from "react";

const Team: React.FC = () => {
  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center flex-col gap-4 mb-10">
        <div className="w-[100px] h-[24px] rounded-[32px] py-[5px] px-3 bg-[#FFB59436] text-center">
          <p className="text-xs font-medium leading-[100%] tracking-[0%] text-[#FE5102] dark:text-[#FE5102]">
            Our Team
          </p>
        </div>
        <p className="font-bold text-[24px] lg:text-[40px] text-center md:text-left leading-[100%] tracking-[0%]">
          The Faces & Minds Behind Bertinarly
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-8">
        <div className="w-full h-[204px] lg:h-[300px] bg-[#EAEAEA] rounded-md"></div>
        <div className="w-full h-[204px] lg:h-[300px] bg-[#EAEAEA] rounded-md"></div>
        <div className="w-full h-[204px] lg:h-[300px] bg-[#EAEAEA] rounded-md"></div>
        <div className="w-full h-[204px] lg:h-[300px] bg-[#EAEAEA] rounded-md"></div>
        <div className="w-full h-[204px] lg:h-[300px] bg-[#EAEAEA] rounded-md"></div>
        <div className="w-full h-[204px] lg:h-[300px] bg-[#EAEAEA] rounded-md"></div>
        <div className="w-full h-[204px] lg:h-[300px] bg-[#EAEAEA] rounded-md"></div>
        <div className="w-full h-[204px] lg:h-[300px] bg-[#EAEAEA] rounded-md"></div>
      </div>
    </div>
  );
};

export default Team;
