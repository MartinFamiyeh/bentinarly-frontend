import heroImage from '../assets/images/hero.png';
import heroDarkImage from '../assets/images/hero_dark.png';
import { useDarkMode } from '../contexts/DarkModeContext';

const HeroImage = () => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className="relative order-first md:order-none mb-8 md:mb-0">
      <div className="aspect-[1.5/1] rounded-[250px] flex items-center justify-center w-[120%] sm:w-[140%] lg:w-[160%] -ml-[10%] sm:-ml-[20%] lg:-ml-[30%] max-w-[1200px] mx-auto overflow-hidden">
        <div className="max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]">
          <img
            src={isDarkMode ? heroDarkImage : heroImage}
            alt="Woman using laptop"
            className="w-full h-auto mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroImage; 