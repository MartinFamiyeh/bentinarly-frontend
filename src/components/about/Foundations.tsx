import React from "react";
import Mission from "../../assets/images/about-mission.png";
import Vision from "../../assets/images/about-vision.png";
import Values from "../../assets/images/about-values.png";
import ValuesDark from "../../assets/images/about-values-dark.png";
import { useDarkMode } from "../../contexts/DarkModeContext";

const Foundations: React.FC = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="p-4">
      <div className="flex items-center flex-col gap-4 mb-10 ">
        <div className=" rounded-[32px] py-3 px-4 bg-[#FFB59436] text-center">
          <p className="text-sm font-medium leading-[100%] tracking-[0%] text-[#FE5102] dark:text-[#FE5102]">
            Vision Mission & Values
          </p>
        </div>
        <p className="font-bold text-[24px] lg:text-[40px] leading-[100%] tracking-[0%]">
          The Foundations of Bentinarly
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-4 md:gap-0 justify-between">
          <div className="about-foundations-card">
            <div>
              <div className="mb-4">
                <div className="about-foundations-icon">
                  <img src={Vision} alt="" className="w-[24px] h-[24px] lg:w-[41px] lg:h-[40px]" />
                </div>
                <div>
                  <p className="font-bold text-base lg:text-2xl">Our Vision</p>
                </div>
              </div>
              <div className="ml-6">
                <ul className="list-disc space-y-4">
                  <li>
                    <p>Our Vision Building businesses and people for the future of Africa.</p>
                  </li>
                  <li>
                    <p>A full stop to all African-centred data problems.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="about-foundations-card">
            <div>
              <div className="mb-4">
                <div className="about-foundations-icon">
                  <img src={Mission} alt="" className="w-[24px] h-[24px] lg:w-[40px] lg:h-[40px]" />
                </div>
                <div>
                  <p className="font-bold text-base lg:text-2xl">Our Mission</p>
                </div>
              </div>
              <div>
                <p className="mb-3">
                  We pride ourselves on being the only Africa-based DIY market research provider
                  with an end-to-end solution. We focus on a mobile-first approach and deliver
                  real-time responses from 500,000+ real consumers across Africa.
                </p>
                <p>
                  Data is the new gold, and at this time, business leaders rely heavily on data for
                  decision-making. Offering the broadest distribution network and narrow targeting,
                  Bentinarly finds the right audience in Africa for any research campaign , at speed
                  and scale. We also offer multiple options for conducting market research
                  templates, advanced questionnaire logic, research design, analysis, reporting, and
                  more.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="about-foundations-card">
          <div>
            <div className="mb-4">
              <div className="about-foundations-icon">
                <img
                  src={isDarkMode ? Values : ValuesDark}
                  alt=""
                  className="w-[24px] h-[24px] lg:w-[55px] lg:h-[40px]"
                />
              </div>
              <div>
                <p className="font-bold text-base lg:text-2xl">Our Values (EILI)</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <ul className="list-disc ml-4">
                  <li>
                    <p className="font-semibold">E- Excellence</p>
                  </li>
                </ul>
                <p>
                  We pursue the highest standards in research, design, and impact because African
                  voices deserve nothing less.
                </p>
              </div>
              <div className="space-y-2">
                <ul className="list-disc ml-4">
                  <li>
                    <p className="font-semibold">I – Integrity</p>
                  </li>
                </ul>
                <p>
                  We act with honesty, transparency, and accountability. Every dataset, insight, and
                  collaboration is rooted in trust and respect for people and communities.
                </p>
              </div>
              <div className="space-y-2">
                <ul className="list-disc ml-4">
                  <li>
                    <p className="font-semibold">L – Learning</p>
                  </li>
                </ul>
                <p>
                  We nurture a culture of continuous growth, both within our team and across the
                  communities we serve. Internally, we prioritize reflection, collaboration, and
                  constant improvement. Externally, through participatory research, data literacy,
                  and storytelling, we empower individuals to learn, unlearn, and lead meaningful
                  change.
                </p>
              </div>
              <div className="space-y-2">
                <ul className="list-disc ml-4">
                  <li>
                    <p className="font-semibold"> I – Innovation</p>
                  </li>
                </ul>
                <p>
                  We challenge the status quo with bold, tech-enabled solutions that drive
                  educational and entrepreneurial reforms across Africa and unlock new
                  possibilities. By transforming how data is accessed, shared, and used, we make it
                  easier for youth, educators, and businesses to solve real problems and reimagine
                  the future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Foundations;
