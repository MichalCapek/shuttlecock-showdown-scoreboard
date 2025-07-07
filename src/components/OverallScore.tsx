
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
      <div className="text-center">
        <div className="text-xl text-green-300 mb-2">{homeTeam}</div>
        <div className="text-6xl font-bold text-white">{homeScore}</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-green-300 text-lg">Overall Score</div>
      </div>
      <div className="text-center">
        <div className="text-xl text-green-300 mb-2">{awayTeam}</div>
        <div className="text-6xl font-bold text-white">{awayScore}</div>
      </div>
    </div>
  );
};

export default OverallScore;
