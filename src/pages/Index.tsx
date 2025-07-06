
import React, { useState } from 'react';
import CourtDisplay from '../components/CourtDisplay';
import OverallMatch from '../components/OverallMatch';
import SponsorArea from '../components/SponsorArea';

const Index = () => {
  // Sample data for demonstration
  const [court1Data, setCourt1Data] = useState({
    homeTeam: { shortName: "HOME", score: 15, sets: 1 },
    awayTeam: { shortName: "AWAY", score: 12, sets: 0 },
    currentSet: 2,
    server: "home" as const
  });

  const [court2Data, setCourt2Data] = useState({
    homeTeam: { shortName: "HOME", score: 8, sets: 0 },
    awayTeam: { shortName: "AWAY", score: 11, sets: 1 },
    currentSet: 2,
    server: "away" as const
  });

  const [overallMatch, setOverallMatch] = useState({
    title: "BWF Championship 2024",
    round: "Semi-Finals",
    homeTeam: "HOME TEAM",
    awayTeam: "AWAY TEAM",
    homeScore: 3,
    awayScore: 2,
    court1Status: "In Progress",
    court2Status: "In Progress"
  });

  const updateOverallScore = (team: 'home' | 'away', increment: boolean) => {
    setOverallMatch(prev => ({
      ...prev,
      homeScore: team === 'home' ? 
        (increment ? prev.homeScore + 1 : Math.max(0, prev.homeScore - 1)) : 
        prev.homeScore,
      awayScore: team === 'away' ? 
        (increment ? prev.awayScore + 1 : Math.max(0, prev.awayScore - 1)) : 
        prev.awayScore
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
      {/* Header with Overall Match Info */}
      <div className="h-24 flex items-center justify-center border-b border-blue-600/30 bg-gradient-to-r from-blue-800/20 to-blue-600/20">
        <OverallMatch data={overallMatch} />
      </div>

      {/* Overall Score Controls */}
      <div className="h-16 flex items-center justify-center space-x-8 border-b border-blue-600/30 bg-gradient-to-r from-slate-800/30 to-blue-800/20">
        <div className="flex items-center space-x-2">
          <span className="text-blue-300 text-sm">Overall Score Controls:</span>
          <button 
            onClick={() => updateOverallScore('home', false)}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            HOME -
          </button>
          <button 
            onClick={() => updateOverallScore('home', true)}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
          >
            HOME +
          </button>
          <button 
            onClick={() => updateOverallScore('away', false)}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            AWAY -
          </button>
          <button 
            onClick={() => updateOverallScore('away', true)}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
          >
            AWAY +
          </button>
        </div>
      </div>

      {/* Main Courts Area */}
      <div className="h-[calc(100vh-200px)] flex">
        {/* Court 1 */}
        <div className="flex-1 p-6 border-r border-blue-600/30">
          <CourtDisplay 
            courtNumber={1} 
            data={court1Data}
            onScoreUpdate={setCourt1Data}
          />
        </div>

        {/* Court 2 */}
        <div className="flex-1 p-6">
          <CourtDisplay 
            courtNumber={2} 
            data={court2Data}
            onScoreUpdate={setCourt2Data}
          />
        </div>
      </div>

      {/* Sponsor Area */}
      <div className="h-20 border-t border-blue-600/30 bg-gradient-to-r from-slate-800/50 to-blue-800/30">
        <SponsorArea />
      </div>
    </div>
  );
};

export default Index;
