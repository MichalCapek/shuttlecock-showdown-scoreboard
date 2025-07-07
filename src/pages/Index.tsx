
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
    <div className="w-full h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white overflow-hidden flex flex-col" style={{ aspectRatio: '16/9' }}>
      {/* Header with Tournament Info Only */}
      <div className="h-16 flex items-center justify-center border-b-2 border-green-500 bg-gradient-to-r from-green-800/40 to-green-600/40">
        <OverallMatch data={overallMatch} />
      </div>

      {/* Overall Score Section */}
      <div className="border-b-4 border-green-500 bg-gradient-to-r from-green-800/30 to-green-700/30 shadow-lg">
        <OverallScore 
          homeTeam={overallMatch.homeTeam}
          awayTeam={overallMatch.awayTeam}
          homeScore={overallMatch.homeScore}
          awayScore={overallMatch.awayScore}
        />
      </div>

      {/* Main Courts Area */}
      <div className="flex-1 flex">
        {/* Court 1 */}
        <div className="flex-1 p-4 border-r-2 border-green-500">
          <CourtDisplay 
            courtNumber={1} 
            data={court1Data}
          />
        </div>

        {/* Court 2 */}
        <div className="flex-1 p-4">
          <CourtDisplay 
            courtNumber={2} 
            data={court2Data}
          />
        </div>
      </div>

      {/* Sponsor Area */}
      <div className="h-16 border-t-2 border-green-500 bg-gradient-to-r from-green-800/50 to-green-700/40">
        <SponsorArea />
      </div>
    </div>
  );
};

export default Index;
