
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
    <div className="flex items-center justify-center w-full py-4">
      <div className="flex items-center space-x-4">
        <Trophy className="h-8 w-8" style={{ color: '#E3161B' }} />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white drop-shadow-md">{data.title}</h1>
          <p className="text-white/90 text-lg font-medium">{data.round}</p>
        </div>
      </div>
    </div>
  );
};

export default OverallMatch;
