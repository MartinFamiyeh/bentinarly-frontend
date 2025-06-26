import React from "react";
import AboutMain from "../components/about/About";
import Foundations from "../components/about/Foundations";
import Founder from "../components/about/Founder";
import Team from "../components/about/Team";

const About: React.FC = () => {
  return (
    <div className="dark:bg-[#0B0B0B]">
      <div className="min-h-screen py-20 bg-cover bg-center bg-no-repeat bg-[url('assets/images/about-background.png')] dark:bg-[url('assets/images/about-dark.png')]">
        <div className="md:w-[680px] lg:w-[1200px] mx-auto">
          <div className="flex justify-center my-8 lg:my-12">
            <p className="w-[398px] md:w-[500px] lg:w-[773px] text-center font-bold text-[24px] lg:text-[40px] leading-[100%] tracking-[0%]">
              Redefining Africa's Narrative with Homegrown Insights
            </p>
          </div>
          <AboutMain />
        </div>
      </div>

      <div className="md:w-[680px] lg:w-[1200px] mx-auto space-y-8 md:space-y-20 py-20 ">
        <Foundations />
        <Founder />
        <Team />
      </div>
    </div>
  );
};

export default About;
