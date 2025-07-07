
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
        <h2 className="text-3xl font-bold text-white mb-3">COURT {courtNumber}</h2>
        {/* Past Sets Scores */}
        {data.pastSets && data.pastSets.length > 0 && (
          <div className="text-white/90 text-lg">
            {data.pastSets.join(', ')}
          </div>
        )}
      </div>

      {/* Teams Display - Side by Side */}
      <div className="flex-1 flex items-center justify-center space-x-6">
        {/* Home Team */}
        <div className={`p-6 rounded-2xl transition-all duration-300 border-2 ${
          data.server === 'home' 
            ? 'border-white shadow-lg shadow-white/20' 
            : 'border-white/30'
        }`} style={{ 
          backgroundColor: data.server === 'home' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 74, 144, 0.3)'
        }}>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-3">{data.homeTeam.shortName}</h3>
            <div className="text-5xl font-bold text-white mb-3">{data.homeTeam.score}</div>
            {data.server === 'home' && (
              <Badge className="text-black text-sm" style={{ backgroundColor: '#E3161B', color: 'white' }}>SERVING</Badge>
            )}
          </div>
        </div>

        {/* VS Divider */}
        <div className="text-center">
          <span className="text-xs font-medium text-white/60">vs</span>
        </div>

        {/* Away Team */}
        <div className={`p-6 rounded-2xl transition-all duration-300 border-2 ${
          data.server === 'away' 
            ? 'border-white shadow-lg shadow-white/20' 
            : 'border-white/30'
        }`} style={{ 
          backgroundColor: data.server === 'away' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 74, 144, 0.3)'
        }}>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-3">{data.awayTeam.shortName}</h3>
            <div className="text-5xl font-bold text-white mb-3">{data.awayTeam.score}</div>
            {data.server === 'away' && (
              <Badge className="text-black text-sm" style={{ backgroundColor: '#E3161B', color: 'white' }}>SERVING</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtDisplay;
