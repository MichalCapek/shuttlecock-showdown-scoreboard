
import React from 'react';

interface OverallScoreProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

const OverallScore: React.FC<OverallScoreProps> = ({ homeTeam, awayTeam, homeScore, awayScore }) => {
  return (
    <div className="flex items-center justify-center space-x-12 py-6">
      <div className="flex items-center space-x-6">
        {/* Home Team Logo - Using the badminton club logo */}
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
          <img 
            src="https://www.badminton-benatky.cz/wp-content/uploads/2023/03/cropped-Logo-BC-Benatky-nad-Jizerou-KRUH-510x510.png" 
            alt="Home Team Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-white mb-2">{homeTeam}</div>
          <div className="text-7xl font-black text-white drop-shadow-lg">{homeScore}</div>
        </div>
      </div>

      <div className="flex flex-col items-center px-8">
        <div className="text-white text-xl font-bold opacity-90">VS</div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-center">
          <div className="text-2xl font-semibold text-white mb-2">{awayTeam}</div>
          <div className="text-7xl font-black text-white drop-shadow-lg">{awayScore}</div>
        </div>
        {/* Away Team Logo */}
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl font-bold" style={{ color: '#E3161B' }}>
            {awayTeam.substring(0, 2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OverallScore;
