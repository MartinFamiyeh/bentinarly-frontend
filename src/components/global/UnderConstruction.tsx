import React, { useState, useEffect } from "react";
import { ArrowLeft, Wrench } from "lucide-react";

const UnderConstruction: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FE5102]/60 via-purple-400/70 to-[#B148F3]/60 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/10 rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        />
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 border border-purple-300/20 rounded-full animate-bounce"
          style={{ animationDuration: "3s" }}
        />
      </div>

      <div
        className={`relative z-10 text-center max-w-2xl mx-auto transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 animate-pulse">
            <Wrench size={64} className="text-white" />
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            We're Building Something Great!
          </h2>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            This page is currently under construction. We're working hard to bring you something
            amazing. Check back soon!
          </p>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-br-full" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-tl-full" />
    </div>
  );
};

export default UnderConstruction;
