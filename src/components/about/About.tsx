import React from "react";
import Frame from "../../assets/images/about-frame.png";
import Mobile from "../../assets/images/about-mobile.png";
import Africa from "../../assets/images/about-africa.png";
import Face from "../../assets/images/about-face.png";
import Globe from "../../assets/images/about-globe.png";
import DarkGlobe from "../../assets/images/about-globe-dark.png";
import DarkAfrica from "../../assets/images/about-africa-dark.png";
import DarkFace from "../../assets/images/about-face-dark.png";
import DarkMobile from "../../assets/images/about-mobile-dark.png";
import { useDarkMode } from "../../contexts/DarkModeContext";

const About: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-5 gap-[32px] p-4">
      <div className="w-full md:flex justify-between gap-8 lg:col-span-2">
        <img
          src={Frame}
          alt="grid"
          className="w-full md:w-[350px] lg:w-[800px] rounded-lg mx-auto"
        />
        <div className="hidden md:block lg:hidden">
          <p className="text-center md:text-left mb-4 ">
            Bentinarly is a transformative DIY research platform committed to illuminating Africa's
            authentic narratives through accessible data, research, and digital storytelling. Our
            DIY research platform empowers businesses, educators, policymakers, and researchers with
            high-quality, Africa-centered data on youth projects. Through local data and
            representation, we prevent the risk of a "single story", where narrow, external
            viewpoints dominate.
          </p>
          <p className="text-center md:text-left">
            By Africans, for Africa, we are building a future where our stories, insights, and
            innovations shape global narratives and drive sustainable development.
          </p>
        </div>
      </div>
      <div className="flex flex-col lg:justify-between lg:col-span-3">
        <div className="mb-8 md:mb-0 md:hidden lg:block">
          <p className="text-center md:text-left mb-4 md:mb-0 lg:mb-4">
            Bentinarly is a transformative DIY research platform committed to illuminating Africa's
            authentic narratives through accessible data, research, and digital storytelling. Our
            DIY research platform empowers businesses, educators, policymakers, and researchers with
            high-quality, Africa-centered data on youth projects. Through local data and
            representation, we prevent the risk of a "single story", where narrow, external
            viewpoints dominate.
          </p>
          <p className="text-center md:text-left">
            By Africans, for Africa, we are building a future where our stories, insights, and
            innovations shape global narratives and drive sustainable development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="about-hero-card">
            <div className="about-hero-card-icon">
              <img src={isDarkMode ? Mobile : DarkMobile} alt="" className="w-[32px] h-[32px]" />
            </div>
            <p className="text-base md:text-[18px] font-bold leading-[100%] tracking-[0%]">
              70% of Africans own mobile phones
            </p>
            <p className="text-base leading-[100%] tracking-[0%]">
              The tools are already in our hands — Bentinarly Poll helps turn access into insight.
            </p>
          </div>
          <div className="about-hero-card">
            <div className="about-hero-card-icon">
              <img src={isDarkMode ? Africa : DarkAfrica} alt="" className="w-[32px] h-[32px]" />
            </div>
            <p className="text-base md:text-[18px] font-bold leading-[100%] tacking-[0%]">
              Less than 1% of global AI data comes from Africa
            </p>
            <p className="text-base leading-[100%] tracking-[0%]">
              Bentinarly Poll is changing that by making African data visible, usable, and ours.
            </p>
          </div>
          <div className="about-hero-card">
            <div className="about-hero-card-icon">
              <img src={isDarkMode ? Face : DarkFace} alt="" className="w-[32px] h-[32px]" />
            </div>
            <p className="text-base md:text-[18px] font-bold leading-[100%] tracking-[0%]">
              70% of Sub-Saharan Africa is under 30
            </p>
            <p className="text-base leading-[100%] tracking-[0%]">
              We're impowering the youngest population in the world to shape tomorrow's solutions
            </p>
          </div>
          <div className="about-hero-card">
            <div className="about-hero-card-icon">
              <img src={isDarkMode ? Globe : DarkGlobe} alt="" className="w-[32px] h-[32px]" />
            </div>
            <p className="text-base md:text-[18px] font-bold leading-[100%] tracking-[0%]">
              By 2030, 42% of the world’s youth will be African
            </p>
            <p className="leading-[100%] tracking-[0%]">
              With Bentinarly Poll, this generation doesn't just grow up — it leads through data and
              storytelling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
