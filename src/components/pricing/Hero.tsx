import { useDarkMode } from "../../contexts/DarkModeContext";
import License from "../../assets/images/pricing-license.png";
import Seats from "../../assets/images/pricing-seats.png";
import Response from "../../assets/images/pricing-response.png";

const Hero = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="px-4 py-20 bg-cover bg-center bg-no-repeat bg-[url('assets/images/about-background.png')] dark:bg-[url('assets/images/about-dark.png')]">
      <div className="md:w-[768px] lg:w-[1024px] mx-auto">
        <div className="flex justify-center my-8 lg:my-12 ">
          <p className="w-[398px] md:w-[500px] lg:w-[773px] text-center font-bold text-[24px] lg:text-[40px] leading-[100%] tracking-[0%]">
            Zero Licensing Fee. Unlimited Seats. Pay Only for What You Use.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="p-4 w-full md:w-[calc(50%-0.5rem)] shadow-sm rounded-lg border-2 border-gray-100 bg-[#FFFFFF] space-y-2 dark:bg-[#0B0B0B] dark:border-[#232323]">
            <div className="w-10 h-8 rounded-lg bg-[#f2f2f2] dark:bg-[#151515] place-items-center place-content-center">
              <img src={License} alt="" />
            </div>
            <p className="font-bold text-sm leading-none">Zero Licensing Fee</p>
            <p className="text-sm leading-none">
              Access all features without any subscription costs.
            </p>
          </div>
          <div className="p-4 w-full md:w-[calc(50%-0.5rem)] shadow-sm rounded-lg border-2 border-gray-100 bg-[#FFFFFF] space-y-2 dark:bg-[#0B0B0B] dark:border-[#232323]">
            <div className="w-10 h-8 rounded-lg bg-[#f2f2f2] dark:bg-[#151515] place-items-center place-content-center">
              <img src={Seats} alt="" />
            </div>
            <p className="font-bold text-sm leading-none">Unlimited Seats</p>
            <p className="text-sm leading-none">
              Collaborate with as many team members as you need—no extra charges.
            </p>
          </div>
          <div className="p-4 w-full md:w-[calc(50%-0.5rem)] shadow-sm rounded-lg border-2 border-gray-100 bg-[#FFFFFF] space-y-2 dark:bg-[#0B0B0B] dark:border-[#232323]">
            <div className="w-10 h-8 rounded-lg bg-[#f2f2f2] dark:bg-[#151515] place-items-center place-content-center">
              <img src={Response} alt="" />
            </div>
            <p className="font-bold text-sm leading-none">Pay-Per-Response</p>
            <p className="text-sm leading-none">
              Only pay for the responses you collect. Pricing may vary based on targeting options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
