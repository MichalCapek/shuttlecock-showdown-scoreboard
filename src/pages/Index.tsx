
import React, { useState } from 'react';
import CourtDisplay from '../components/CourtDisplay';
import OverallMatch from '../components/OverallMatch';
import OverallScore from '../components/OverallScore';
import SponsorArea from '../components/SponsorArea';

interface CourtData {
  homeTeam: { shortName: string; score: number; sets: number };
  awayTeam: { shortName: string; score: number; sets: number };
  currentSet: number;
  server: 'home' | 'away';
  pastSets?: string[];
}

const Index = () => {
  // Sample data for demonstration
  const [court1Data, setCourt1Data] = useState<CourtData>({
    homeTeam: { shortName: "HOME", score: 15, sets: 1 },
    awayTeam: { shortName: "AWAY", score: 12, sets: 0 },
    currentSet: 2,
    server: "home",
    pastSets: ["21-19"]
  });

  const [court2Data, setCourt2Data] = useState<CourtData>({
    homeTeam: { shortName: "HOME", score: 8, sets: 0 },
    awayTeam: { shortName: "AWAY", score: 11, sets: 1 },
    currentSet: 2,
    server: "away",
    pastSets: ["18-21"]
  });

  const [overallMatch] = useState({
    title: "BWF Championship 2024",
    round: "Semi-Finals",
    homeTeam: "HOME TEAM",
    awayTeam: "AWAY TEAM",
    homeScore: 3,
    awayScore: 2,
    court1Status: "In Progress",
    court2Status: "In Progress"
  });

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div 
        className="w-full max-w-screen-2xl text-white overflow-hidden flex flex-col shadow-2xl" 
        style={{ 
          aspectRatio: '16/9',
          background: 'linear-gradient(135deg, #004A90 0%, #E3161B 100%)'
        }}
      >
        {/* Header with Tournament Info Only */}
        <div className="h-[12%] flex items-center justify-center border-b-4 border-white/60" style={{ backgroundColor: 'rgba(0, 74, 144, 0.95)' }}>
          <OverallMatch data={overallMatch} />
        </div>

        {/* Overall Score Section */}
        <div className="h-[25%] border-b-4 border-white/80 shadow-2xl" style={{ backgroundColor: 'rgba(227, 22, 27, 0.95)' }}>
          <OverallScore 
            homeTeam={overallMatch.homeTeam}
            awayTeam={overallMatch.awayTeam}
            homeScore={overallMatch.homeScore}
            awayScore={overallMatch.awayScore}
          />
        </div>

        {/* Main Courts Area */}
        <div className="h-[53%] flex">
          {/* Court 1 */}
          <div className="flex-1 px-6 border-r-4 border-white/60">
            <CourtDisplay 
              courtNumber={1} 
              data={court1Data}
            />
          </div>

          {/* Court 2 */}
          <div className="flex-1 px-6">
            <CourtDisplay 
              courtNumber={2} 
              data={court2Data}
            />
          </div>
        </div>

        {/* Sponsor Area */}
        <div className="h-[10%] border-t-4 border-white/60" style={{ backgroundColor: 'rgba(0, 74, 144, 0.95)' }}>
          <SponsorArea />
        </div>
      </div>
    </div>
  );
};

export default Index;
