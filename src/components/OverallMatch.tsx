
import React from 'react';
import { Badge } from '@/components/ui/badge';
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
    <div className="flex items-center justify-between w-full max-w-6xl px-8">
      {/* Left Section - Tournament Info */}
      <div className="flex items-center space-x-4">
        <Trophy className="h-8 w-8 text-yellow-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">{data.title}</h1>
          <p className="text-blue-300">{data.round}</p>
        </div>
      </div>

      {/* Center Section - Overall Team Score */}
      <div className="flex items-center space-x-8">
        <div className="text-center">
          <div className="text-lg text-blue-300 mb-2">{data.homeTeam}</div>
          <div className="text-6xl font-bold text-white">{data.homeScore}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse mb-2"></div>
          <span className="text-red-400 font-semibold text-lg">LIVE</span>
          <div className="text-blue-300 text-sm mt-2">Overall Score</div>
        </div>
        <div className="text-center">
          <div className="text-lg text-blue-300 mb-2">{data.awayTeam}</div>
          <div className="text-6xl font-bold text-white">{data.awayScore}</div>
        </div>
      </div>

      {/* Right Section - Court Status */}
      <div className="flex items-center space-x-6">
        <div className="text-center">
          <div className="text-sm text-blue-300 mb-1">Court 1</div>
          <Badge variant={data.court1Status === 'In Progress' ? 'default' : 'secondary'}>
            {data.court1Status}
          </Badge>
        </div>
        <div className="text-center">
          <div className="text-sm text-blue-300 mb-1">Court 2</div>
          <Badge variant={data.court2Status === 'In Progress' ? 'default' : 'secondary'}>
            {data.court2Status}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default OverallMatch;
