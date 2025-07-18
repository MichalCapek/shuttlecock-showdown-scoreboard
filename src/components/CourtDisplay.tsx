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
  server: "home" | "away";
  pastSets?: { teamA: number; teamB: number }[];
}

interface CourtDisplayProps {
  courtNumber: number;
  data: CourtData;
}

const CourtDisplay: React.FC<CourtDisplayProps> = ({ courtNumber, data }) => {
  return (
      <div className="h-full flex flex-col py-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">KURT {courtNumber}</h2>
          {data.pastSets?.length > 0 && (
              <div className="text-white/90 text-lg sm:text-2xl font-medium">
                {data.pastSets.map((set) => `${set.teamA}:${set.teamB}`).join(", ")}
              </div>
          )}
        </div>

        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          <div
              className={`p-6 sm:p-10 rounded-2xl transition-all duration-300 border-4 ${
                  data.server === 'home'
                      ? 'border-white shadow-lg shadow-white/20'
                      : 'border-white/30'
              }`}
              style={{
                backgroundColor: data.server === 'home' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 74, 144, 0.3)'
              }}
          >
            <div className="text-center">
              <h3 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">{data.homeTeam.shortName}</h3>
              <div className="text-6xl sm:text-8xl font-bold text-white mb-4 sm:mb-6">{data.homeTeam.score}</div>
              {data.server === 'home' && (
                  <Badge className="text-white text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 bg-destructive">SERVIS</Badge>
              )}
            </div>
          </div>

          <div className="text-center">
            <span className="text-xl sm:text-2xl font-bold text-muted-foreground">vs</span>
          </div>

          <div
              className={`p-6 sm:p-10 rounded-2xl transition-all duration-300 border-4 ${
                  data.server === 'away'
                      ? 'border-white shadow-lg shadow-white/20'
                      : 'border-white/30'
              }`}
              style={{
                backgroundColor: data.server === 'away' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 74, 144, 0.3)'
              }}
          >
            <div className="text-center">
              <h3 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">{data.awayTeam.shortName}</h3>
              <div className="text-6xl sm:text-8xl font-bold text-white mb-4 sm:mb-6">{data.awayTeam.score}</div>
              {data.server === 'away' && (
                  <Badge className="text-white text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2" style={{ backgroundColor: '#E3161B', color: 'white' }}>SERVIS</Badge>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default CourtDisplay;
