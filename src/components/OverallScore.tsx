
import React from 'react';

interface OverallScoreProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

const OverallScore: React.FC<OverallScoreProps> = ({ homeTeam, awayTeam, homeScore, awayScore }) => {
  return (
    <div className="flex items-center justify-center space-x-8 py-3">
      <div className="flex items-center space-x-3">
        {/* Home Team Logo */}
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-lg font-bold" style={{ color: '#004A90' }}>
            {homeTeam.substring(0, 2)}
          </span>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-white mb-1">{homeTeam}</div>
          <div className="text-5xl font-black text-white drop-shadow-lg">{homeScore}</div>
        </div>
      </div>

      <div className="flex flex-col items-center px-4">
        <div className="text-white text-sm font-medium opacity-80">Overall Score</div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="text-center">
          <div className="text-lg font-semibold text-white mb-1">{awayTeam}</div>
          <div className="text-5xl font-black text-white drop-shadow-lg">{awayScore}</div>
        </div>
        {/* Away Team Logo */}
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-lg font-bold" style={{ color: '#E3161B' }}>
            {awayTeam.substring(0, 2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OverallScore;
