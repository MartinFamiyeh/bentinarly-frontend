import React from 'react';
import type { IconType } from 'react-icons';
import '../styles/orbit.css';

interface FeatureCardProps {
  Icon: IconType;
  title: string;
  description: string;
  orbitDelay: number;
  angle: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, description, angle }) => {
  return (
    <div 
      className="orbit-card"
      style={{
        animationDelay: `${-angle/360 * 30}s`
      }}
    >
      <div className="orbit-card-content bg-white dark:bg-[#1C1C1C] p-3 rounded-xl shadow-lg w-[180px] hover:scale-105 transition-transform">
        <div className="flex flex-col items-start">
          <div className="text-[#FF4500] text-xl mb-2">
            <Icon />
          </div>
          <div>
            <h3 className="font-semibold text-base mb-0.5">{title}</h3>
            <p className="text-gray-600 text-xs">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard; 