
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
      <div className="flex items-center space-x-6">
        <Trophy className="h-12 w-12 text-yellow-400" />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">{data.title}</h1>
          <p className="text-blue-300 text-lg">{data.round}</p>
        </div>
      </div>
    </div>
  );
};

export default OverallMatch;
