
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
    <div className="flex items-center justify-center w-full">
      <div className="flex items-center space-x-4">
        <Trophy className="h-6 w-6" style={{ color: '#E3161B' }} />
        <div className="text-center">
          <h1 className="text-lg font-bold text-white">{data.title}</h1>
          <p className="text-white/80 text-sm">{data.round}</p>
        </div>
      </div>
    </div>
  );
};

export default OverallMatch;
