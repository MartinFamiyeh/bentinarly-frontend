import Create from "../../assets/images/solutions-create.png";
import Analyze from "../../assets/images/solutions-analyze.png";
import Collect from "../../assets/images/solutions-collect.png";
import AnalyzeDark from "../../assets/images/solutions-analyze-dark.png";
import CreateDark from "../../assets/images/solutions-create-dark.png";
import CollectDark from "../../assets/images/solutions-collect-dark.png";
import { FaArrowRight, FaArrowDown } from "react-icons/fa6";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { HiOutlineArrowPathRoundedSquare } from "react-icons/hi2";

const Hero = () => {
  const { isDarkMode } = useDarkMode();

  const cards = [
    {
      lightImage: Create,
      darkImage: CreateDark,
      icons: {
        mobile: FaArrowDown,
        desktop: FaArrowRight,
      },
      title: "Create",
      description: "Simply link to your existing study or craft one using our intuitive tool.",
    },
    {
      lightImage: Collect,
      darkImage: CollectDark,
      icons: {
        mobile: FaArrowDown,
        desktop: FaArrowRight,
      },
      title: "Collect",
      description:
        "Set your participant count, choose your audience, and start collecting data instantly.",
    },
    {
      lightImage: Analyze,
      darkImage: AnalyzeDark,
      icons: {
        mobile: HiOutlineArrowPathRoundedSquare,
        desktop: HiOutlineArrowPathRoundedSquare,
      },
      title: "Analyze",
      description:
        "Transform raw responses into actionable insights with our intuitive analysis tools.",
    },
  ];

  return (
    <div className="min-h-screen md:h-auto lg:min-h-screen py-20 bg-cover bg-center bg-no-repeat bg-[url('assets/images/about-background.png')] dark:bg-[url('assets/images/about-dark.png')]">
      <div className="md:w-[900px] lg:w-[1200px] mx-auto">
        <div className="flex justify-center my-8 lg:my-12">
          <p className="w-[398px] md:w-[500px] lg:w-[773px] text-center font-bold text-[24px] lg:text-[40px] leading-[100%] tracking-[0%]">
            Simplify Data Collection, Amplify Results.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-8 mx-auto  place-items-center p-4">
          {cards.map((card, index) => {
            const MobileIcon = card.icons.mobile;
            const DesktopIcon = card.icons.desktop;
            const iconColor = isDarkMode ? "#3D3D3D" : "#CECECE";
            const isLast = index === cards.length - 1;

            return (
              <div
                key={index}
                className={`w-full md:w-[380px] lg:w-[300px] xl:w-full border-2 border-[#f2f2f2] dark:border-[#232323] shadow-sm rounded-2xl bg-[#ffffff] dark:bg-[#0B0B0B] pt-8 p-4
        ${
          isLast ? "md:col-span-2 md:justify-self-center lg:col-span-1 lg:justify-self-auto" : ""
        }`}>
                <div className="h-full w-full flex flex-col items-center space-y-4">
                  <img src={isDarkMode ? card.darkImage : card.lightImage} alt="card-image" />
                  <p className="text-lg font-bold leading-[100%] tracking-[0%]">{card.title}</p>
                  <p className="text-base text-center leading-[100%] tracking-[0%]">
                    {card.description}
                  </p>
                  <div className="w-[34px] h-[34px] rounded-full bg-[#F2F2F2] dark:bg-[#1b1b1b] flex justify-center items-center">
                    <MobileIcon className="block md:hidden" color={iconColor} size={15} />
                    <DesktopIcon className="hidden md:block" color={iconColor} size={15} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Hero;
