import React from 'react';

export interface FeatureSectionProps {
  imgPosition: 'left' | 'right';
  title: string;
  badgeLabel: string;
  imgSrc: string;
  description: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  imgPosition,
  title,
  badgeLabel,
  imgSrc,
  description,
}) => {
  const isImgLeft = imgPosition === 'left';
  const imgOrderClass = isImgLeft ? 'order-1 sm:order-1' : 'order-2 sm:order-2';
  const contentOrderClass = isImgLeft ? 'order-2 sm:order-2' : 'order-1 sm:order-1';

  return (
    <section className="w-full md:w-[90%] mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
      {/* Content */}
      <div className={`w-full sm:w-1/2 ${contentOrderClass} px-2 sm:px-6 md:px-8 lg:px-0 text-center sm:text-left order-1`}>
        {badgeLabel && (
          <span className="inline-block mb-2 px-2 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#FFB59436] dark:bg-[#232323] text-[#FE5102] text-xs sm:text-sm font-semibold">
            {badgeLabel}
          </span>
        )}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-[#232323] dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="text-xs sm:text-sm md:text-base text-[#232323] dark:text-[#E5E5E5] font-normal mb-4 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Image */}
      <div className={`w-full sm:w-1/2 flex justify-center ${imgOrderClass} order-2`}>
        <img 
          src={imgSrc} 
          alt={title} 
          className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px] h-auto object-contain" 
        />
      </div>
    </section>
  );
};

export default FeatureSection;
