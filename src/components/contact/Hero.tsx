import React from "react";

const Hero = () => {
  return (
    <div className="min-h-screen md:h-auto lg:min-h-screen py-20 bg-cover bg-center bg-no-repeat bg-[url('assets/images/about-background.png')] dark:bg-[url('assets/images/about-dark.png')]">
      <div className="md:w-[900px] lg:w-[1200px] mx-auto">
        <div className="flex justify-center my-8 lg:my-12">
          <p className="w-[398px] md:w-[500px] lg:w-[773px] text-center font-bold text-[24px] lg:text-[40px] leading-[100%] tracking-[0%]">
            We're Here to Connect
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
