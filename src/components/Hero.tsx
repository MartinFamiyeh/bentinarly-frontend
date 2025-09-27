import { FaQuestionCircle, FaLightbulb, FaUsers } from 'react-icons/fa';
import HeroImage from './HeroImage';
import FeatureCard from './FeatureCard';
import heroBackground from '../assets/images/home_hero_bg.png';
import heroDarkBackground from '../assets/images/home_hero_dark_bg.png';
import { useDarkMode } from '../contexts/DarkModeContext';

const Hero = () => {
  const { isDarkMode } = useDarkMode();
  const features = [
    {
      Icon: FaQuestionCircle,
      title: "Ask Smarter",
      description: "Craft questions that get real answers.",
      orbitDelay: 0,
      angle: 0
    },
    {
      Icon: FaUsers,
      title: "Reach Better",
      description: "Connect with the audience that matters.",
      orbitDelay: 0,
      angle: 120
    },
    {
      Icon: FaLightbulb,
      title: "Know Faster",
      description: "Insights that keep up with your pace.",
      orbitDelay: 0,
      angle: 240
    }
  ];

  return (
    <div 
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 overflow-hidden"
      style={{
        backgroundImage: `url(${isDarkMode ? heroDarkBackground : heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Content */}
      <div className="relative z-10">
        <div className="text-center mb-4 sm:mb-6 mt-8 sm:mt-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            <span className="text-[#FF4500]">Insights</span>{' '}
            <span className="text-gray-800 dark:text-white">Rooted in</span>{' '}
            <span className="text-[#A020F0]">Africa</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#292929] mb-6 sm:mb-8 px-4">
            Your full stop to Africa-centered data problems.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <button className="bg-gradient-to-r from-[#FE5102] to-[#B148F3] text-white dark:text-black px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all w-full sm:w-auto">
              Create Your First Survey
            </button>
            <button className="border-2 border-[#FF4500] text-[#FF4500] px-6 py-3 rounded-full font-medium hover:bg-[#FF4500] hover:text-white transition-colors w-full sm:w-auto">
              Become a Participant
            </button>
          </div>
        </div>

        <div className="relative h-[350px] sm:h-[450px] lg:h-[500px] -mt-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <HeroImage />
          </div>
          <div className="absolute inset-0 flex items-center justify-center origin-center">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 