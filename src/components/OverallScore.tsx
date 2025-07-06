
import React from 'react';

interface OverallScoreProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

const OverallScore: React.FC<OverallScoreProps> = ({ homeTeam, awayTeam, homeScore, awayScore }) => {
  return (
    <div className="flex items-center justify-center space-x-12 py-8">
      <div className="text-center">
        <div className="text-2xl text-blue-300 mb-3">{homeTeam}</div>
        <div className="text-8xl font-bold text-white">{homeScore}</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse mb-3"></div>
        <span className="text-red-400 font-bold text-xl">LIVE</span>
        <div className="text-blue-300 text-lg mt-3">Overall Score</div>
      </div>
      <div className="text-center">
        <div className="text-2xl text-blue-300 mb-3">{awayTeam}</div>
        <div className="text-8xl font-bold text-white">{awayScore}</div>
      </div>
    </div>
  );
};

export default OverallScore;
