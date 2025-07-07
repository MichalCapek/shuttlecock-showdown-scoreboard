
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
  pastSets?: string[];
}

interface CourtDisplayProps {
  courtNumber: number;
  data: CourtData;
}

const CourtDisplay: React.FC<CourtDisplayProps> = ({ courtNumber, data }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Court Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-green-300 mb-3">COURT {courtNumber}</h2>
        {/* Past Sets Scores */}
        {data.pastSets && data.pastSets.length > 0 && (
          <div className="text-green-300 text-lg">
            Past sets: {data.pastSets.join(', ')}
          </div>
        )}
      </div>

      {/* Teams Display - Side by Side */}
      <div className="flex-1 flex items-center justify-center space-x-6">
        {/* Home Team */}
        <div className={`p-6 rounded-2xl transition-all duration-300 ${
          data.server === 'home' 
            ? 'bg-gradient-to-r from-yellow-600/30 to-yellow-500/20 border-2 border-yellow-400 shadow-lg shadow-yellow-400/20' 
            : 'bg-gradient-to-r from-green-700/30 to-green-600/20 border-2 border-green-500/30'
        }`}>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-3">{data.homeTeam.shortName}</h3>
            <div className="text-5xl font-bold text-white mb-3">{data.homeTeam.score}</div>
            {data.server === 'home' && (
              <Badge className="bg-yellow-500 text-black text-sm">SERVING</Badge>
            )}
          </div>
        </div>

        {/* VS Divider */}
        <div className="text-center">
          <span className="text-sm font-medium text-green-300">vs</span>
        </div>

        {/* Away Team */}
        <div className={`p-6 rounded-2xl transition-all duration-300 ${
          data.server === 'away' 
            ? 'bg-gradient-to-r from-yellow-600/30 to-yellow-500/20 border-2 border-yellow-400 shadow-lg shadow-yellow-400/20' 
            : 'bg-gradient-to-r from-green-700/30 to-green-600/20 border-2 border-green-500/30'
        }`}>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-3">{data.awayTeam.shortName}</h3>
            <div className="text-5xl font-bold text-white mb-3">{data.awayTeam.score}</div>
            {data.server === 'away' && (
              <Badge className="bg-yellow-500 text-black text-sm">SERVING</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtDisplay;
