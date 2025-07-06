
import React, { useState } from 'react';
import CourtDisplay from '../components/CourtDisplay';
import OverallMatch from '../components/OverallMatch';
import SponsorArea from '../components/SponsorArea';

const Index = () => {
  // Sample data for demonstration
  const [court1Data, setCourt1Data] = useState({
    team1: { name: "Player A", score: 15, sets: 1 },
    team2: { name: "Player B", score: 12, sets: 0 },
    currentSet: 2,
    server: 1
  });

  const [court2Data, setCourt2Data] = useState({
    team1: { name: "Player C", score: 8, sets: 0 },
    team2: { name: "Player D", score: 11, sets: 1 },
    currentSet: 2,
    server: 2
  });

  const [overallMatch, setOverallMatch] = useState({
    title: "BWF Championship 2024",
    round: "Semi-Finals",
    court1Status: "In Progress",
    court2Status: "In Progress"
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
      {/* Header with Overall Match Info */}
      <div className="h-20 flex items-center justify-center border-b border-blue-600/30 bg-gradient-to-r from-blue-800/20 to-blue-600/20">
        <OverallMatch data={overallMatch} />
      </div>

      {/* Main Courts Area */}
      <div className="h-[calc(100vh-160px)] flex">
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
