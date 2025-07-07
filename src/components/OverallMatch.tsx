
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
        <Trophy className="h-8 w-8 text-yellow-500" />
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">{data.title}</h1>
          <p className="text-green-300 text-sm">{data.round}</p>
        </div>
      </div>
    </div>
  );
};

export default OverallMatch;
