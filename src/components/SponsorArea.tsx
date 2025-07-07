
import React, { useState, useEffect } from 'react';

const SponsorArea: React.FC = () => {
  const [currentSponsor, setCurrentSponsor] = useState(0);
  
  // Sample sponsor data - replace with actual sponsor logos
  const sponsors = [
    { name: "Yonex", color: "#E3161B" },
    { name: "Victor", color: "#004A90" },
    { name: "Li-Ning", color: "#E3161B" },
    { name: "BWF", color: "#004A90" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSponsor((prev) => (prev + 1) % sponsors.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [sponsors.length]);

  return (
    <div className="h-full flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      
      {/* Sponsor Content */}
      <div className="flex items-center space-x-8 z-10">
        <span className="text-white font-medium">Official Partners:</span>
        
        <div className="flex items-center space-x-6">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.name}
              className={`transition-all duration-500 ${
                index === currentSponsor 
                  ? 'opacity-100 scale-110 transform' 
                  : 'opacity-40 scale-100'
              }`}
            >
              <div className="px-6 py-2 rounded-lg shadow-lg" style={{ backgroundColor: sponsor.color }}>
                <span className="text-white font-bold text-lg">{sponsor.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-sm text-white/70">
          Powered by Badminton Championship
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute left-0 top-0 h-full w-2" style={{ background: 'linear-gradient(to bottom, #E3161B, transparent)' }}></div>
      <div className="absolute right-0 top-0 h-full w-2" style={{ background: 'linear-gradient(to bottom, #E3161B, transparent)' }}></div>
    </div>
  );
};

export default SponsorArea;
