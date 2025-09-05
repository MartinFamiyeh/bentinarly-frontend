import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    setIsVisible(true);

    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  from-[#FE5102]  via-purple-400 to-[#B148F3]  flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/10 rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        />
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 border border-purple-300/20 rounded-full animate-bounce"
          style={{ animationDuration: "3s" }}
        />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rotate-12 animate-pulse" />
      </div>

      <div
        className={`relative z-10 text-center max-w-2xl mx-auto transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-black text-white bg-clip-text text-transparent animate-pulse mb-4">
            404
          </h1>
          <div
            className="absolute inset-0 text-8xl md:text-9xl font-black text-white/5 animate-pulse"
            style={{ animationDelay: "0.5s" }}>
            404
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Oops! Page Not Found</h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            The page you're looking for seems to have wandered off into the digital void. Don't
            worry though, even the best explorers sometimes take a wrong turn.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={handleGoBack}
            className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            Go Back
          </button>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-br-full" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-tl-full" />
    </div>
  );
};

export default NotFound;
