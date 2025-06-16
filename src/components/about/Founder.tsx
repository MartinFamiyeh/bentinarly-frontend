import React from "react";
import FounderImage from "../../assets/images/about-founder.png";

const Founder: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 p-4">
      <div className="space-y-4 md:col-span-3">
        <div className="space-y-2">
          <div className="flex justify-center md:justify-start">
            <div className="w-[130px] h-[24px] rounded-[32px] py-[5px] px-3 bg-[#FFB59436] text-center ">
              <p className="text-xs font-medium leading-[100%] tracking-[0%] text-[#FE5102] dark:text-[#FE5102]">
                Founder's Story
              </p>
            </div>
          </div>
          <p className="font-bold text-[24px] lg:text-[40px] leading-[100%] tracking-[0%] text-center md:text-left">
            Elizabeth Ewudina
          </p>
        </div>
        <div>
          <p className="text-center md:text-left">
            During my academic journey, I faced a significant challenge: accessing reliable, local
            data in Africa was nearly impossible. Most organizations were unwilling to share
            information, and the few that did were personal contacts, making convenience sampling
            the norm rather than the exception. While exploring solutions, I discovered DIY research
            platforms that facilitated incentive-driven participation. However, these platforms were
            predominantly based in Europe and the U.S., with minimal representation from African
            voices. It became evident that there was no centralized platform offering
            Africa-centered data at the click of a button. This gap doesn't just hinder students
            like me; it affects countless African researchers, entrepreneurs, and innovators who are
            excluded from data-driven spaces. The lack of accessible local data contributes to
            Africa's underrepresentation in global surveys and AI systems. Motivated by these
            challenges, my team and I founded Bentinarly—a transformative, youth-powered research
            platform. Our mission is to equip African youth, educators, businesses, and changemakers
            with the tools to conduct research, share data, and engage in digital storytelling.
            Through Bentinarly, we aim to amplify Africa's voice and ensure the continent shapes its
            own narrative.
          </p>
        </div>
      </div>
      <div className="md:col-span-2 md:flex items-center">
        <img src={FounderImage} alt="founder" className="mx-auto" />
      </div>
    </div>
  );
};

export default Founder;
