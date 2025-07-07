
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
    <div className="h-full flex flex-col py-6">
      {/* Court Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">COURT {courtNumber}</h2>
        {/* Past Sets Scores */}
        {data.pastSets && data.pastSets.length > 0 && (
          <div className="text-white/90 text-2xl font-medium">
            {data.pastSets.join(', ')}
          </div>
        )}
      </div>

      {/* Teams Display - Side by Side */}
      <div className="flex-1 flex items-center justify-center space-x-12">
        {/* Home Team */}
        <div className={`p-10 rounded-2xl transition-all duration-300 border-4 ${
          data.server === 'home' 
            ? 'border-white shadow-lg shadow-white/20' 
            : 'border-white/30'
        }`} style={{ 
          backgroundColor: data.server === 'home' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 74, 144, 0.3)'
        }}>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-6">{data.homeTeam.shortName}</h3>
            <div className="text-8xl font-bold text-white mb-6">{data.homeTeam.score}</div>
            {data.server === 'home' && (
              <Badge className="text-white text-lg px-4 py-2" style={{ backgroundColor: '#E3161B', color: 'white' }}>SERVING</Badge>
            )}
          </div>
        </div>

        {/* VS Divider */}
        <div className="text-center">
          <span className="text-2xl font-bold text-white/80">vs</span>
        </div>

        {/* Away Team */}
        <div className={`p-10 rounded-2xl transition-all duration-300 border-4 ${
          data.server === 'away' 
            ? 'border-white shadow-lg shadow-white/20' 
            : 'border-white/30'
        }`} style={{ 
          backgroundColor: data.server === 'away' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 74, 144, 0.3)'
        }}>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-6">{data.awayTeam.shortName}</h3>
            <div className="text-8xl font-bold text-white mb-6">{data.awayTeam.score}</div>
            {data.server === 'away' && (
              <Badge className="text-white text-lg px-4 py-2" style={{ backgroundColor: '#E3161B', color: 'white' }}>SERVING</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtDisplay;
