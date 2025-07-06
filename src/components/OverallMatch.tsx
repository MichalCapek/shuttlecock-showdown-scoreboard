
import React from 'react';
import { Trophy } from 'lucide-react';

interface OverallMatchProps {
  data: {
    title: string;
    round: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    court1Status: string;
    court2Status: string;
  };
}

const OverallMatch: React.FC<OverallMatchProps> = ({ data }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-7xl px-12">
      {/* Left Section - Tournament Info */}
      <div className="flex items-center space-x-6">
        <Trophy className="h-12 w-12 text-yellow-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">{data.title}</h1>
          <p className="text-blue-300 text-lg">{data.round}</p>
        </div>
      </div>

      {/* Center Section - Overall Team Score (More Prominent) */}
      <div className="flex items-center space-x-12">
        <div className="text-center">
          <div className="text-2xl text-blue-300 mb-3">{data.homeTeam}</div>
          <div className="text-8xl font-bold text-white">{data.homeScore}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse mb-3"></div>
          <span className="text-red-400 font-bold text-xl">LIVE</span>
          <div className="text-blue-300 text-lg mt-3">Overall Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl text-blue-300 mb-3">{data.awayTeam}</div>
          <div className="text-8xl font-bold text-white">{data.awayScore}</div>
        </div>
      </div>

      {/* Right Section - Empty space for balance */}
      <div className="w-48"></div>
    </div>
  );
};

export default OverallMatch;
