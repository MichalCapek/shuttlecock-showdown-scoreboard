
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TeamData {
  shortName: string;
  score: number;
  sets: number;
}

interface CourtData {
  homeTeam: TeamData;
  awayTeam: TeamData;
  currentSet: number;
  server: 'home' | 'away';
}

interface CourtDisplayProps {
  courtNumber: number;
  data: CourtData;
}

const CourtDisplay: React.FC<CourtDisplayProps> = ({ courtNumber, data }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Court Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-blue-300 mb-4">COURT {courtNumber}</h2>
        <Badge variant="outline" className="text-xl px-6 py-3 border-blue-400 text-blue-300">
          Set {data.currentSet}
        </Badge>
      </div>

      {/* Teams Display - Side by Side */}
      <div className="flex-1 flex items-center justify-center space-x-16">
        {/* Home Team */}
        <div className={`p-8 rounded-2xl transition-all duration-300 ${
          data.server === 'home' 
            ? 'bg-gradient-to-r from-green-600/30 to-green-500/20 border-2 border-green-400 shadow-lg shadow-green-400/20' 
            : 'bg-gradient-to-r from-slate-700/30 to-slate-600/20 border-2 border-slate-500/30'
        }`}>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-4">{data.homeTeam.shortName}</h3>
            <div className="text-7xl font-bold text-white mb-4">{data.homeTeam.score}</div>
            <div className="flex items-center justify-center space-x-4">
              <span className="text-lg text-blue-300">Sets: {data.homeTeam.sets}</span>
              {data.server === 'home' && (
                <Badge className="bg-green-500 text-white text-sm">SERVING</Badge>
              )}
            </div>
          </div>
        </div>

        {/* VS Divider */}
        <div className="text-center">
          <span className="text-4xl font-bold text-blue-300">VS</span>
        </div>

        {/* Away Team */}
        <div className={`p-8 rounded-2xl transition-all duration-300 ${
          data.server === 'away' 
            ? 'bg-gradient-to-r from-green-600/30 to-green-500/20 border-2 border-green-400 shadow-lg shadow-green-400/20' 
            : 'bg-gradient-to-r from-slate-700/30 to-slate-600/20 border-2 border-slate-500/30'
        }`}>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-4">{data.awayTeam.shortName}</h3>
            <div className="text-7xl font-bold text-white mb-4">{data.awayTeam.score}</div>
            <div className="flex items-center justify-center space-x-4">
              <span className="text-lg text-blue-300">Sets: {data.awayTeam.sets}</span>
              {data.server === 'away' && (
                <Badge className="bg-green-500 text-white text-sm">SERVING</Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtDisplay;
