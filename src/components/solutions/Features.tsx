import React from "react";

export interface FeatureSectionProps {
  imgPosition: "left" | "right";
  title: string;
  badgeLabel: string;
  image: string;
  description: string;
  trailText: string;
  bulletPoints: Array<string>;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  imgPosition,
  title,
  badgeLabel,
  image,
  description,
  trailText,
  bulletPoints,
}) => {
  const isImgLeft = imgPosition === "left";
  const imgOrderClass = isImgLeft ? "order-1 sm:order-1" : "order-2 sm:order-2";
  const contentOrderClass = isImgLeft ? "order-2 sm:order-2" : "order-1 sm:order-1";

  return (
    <section className="w-full mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 px-4">
      <div className={`w-full sm:w-1/2 ${contentOrderClass} text-center sm:text-left order-1`}>
        {badgeLabel && (
          <span className="capitalize inline-block mb-2 px-2 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#FFB59436] dark:bg-[#232323] text-[#FE5102] text-xs sm:text-sm font-semibold">
            {badgeLabel}
          </span>
        )}
        <h2 className="capitalize text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-[#232323] dark:text-white leading-[100%] tracking-[0%]">
          {title}
        </h2>
        {description && (
          <p className="text-xs sm:text-sm md:text-base text-[#232323] dark:text-[#E5E5E5] leading-[100%] tracking-[0%] mb-4">
            {description}
          </p>
        )}
        {bulletPoints && (
          <div className="text-xs sm:text-sm md:text-base text-[#232323] dark:text-[#E5E5E5] font-normal mb-3">
            <ul className="ml-6">
              {bulletPoints.map((point, index) => (
                <li key={index} className="list-disc leading-[100%] tracking-[0%] mb-2">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="leading-[100%] tracking-[0%]">{trailText}</p>
      </div>

      <div className={`w-full sm:w-1/2 flex justify-center ${imgOrderClass} order-2`}>
        <div
          style={{ backgroundImage: `url(${image})` }}
          className="w-full max-w-[320px] md:max-w-[277px] lg:max-w-[488px] xl:max-w-full h-[298px] md:h-[422px] lg:h-[446px] bg-center bg-cover rounded-xl"
          aria-label={title}
          role="img"></div>
      </div>
    </section>
  );
};

export default FeatureSection;
