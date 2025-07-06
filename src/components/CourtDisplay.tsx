
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

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
  onScoreUpdate: (data: CourtData) => void;
}

const CourtDisplay: React.FC<CourtDisplayProps> = ({ courtNumber, data, onScoreUpdate }) => {
  const updateScore = (team: 'homeTeam' | 'awayTeam', increment: boolean) => {
    const newData = { ...data };
    if (increment) {
      newData[team].score += 1;
    } else if (newData[team].score > 0) {
      newData[team].score -= 1;
    }
    onScoreUpdate(newData);
  };

  const updateSets = (team: 'homeTeam' | 'awayTeam', increment: boolean) => {
    const newData = { ...data };
    if (increment) {
      newData[team].sets += 1;
    } else if (newData[team].sets > 0) {
      newData[team].sets -= 1;
    }
    onScoreUpdate(newData);
  };

  const toggleServer = () => {
    onScoreUpdate({ ...data, server: data.server === 'home' ? 'away' : 'home' });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Court Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-blue-300 mb-2">COURT {courtNumber}</h2>
        <Badge variant="outline" className="text-lg px-4 py-2 border-blue-400 text-blue-300">
          Set {data.currentSet}
        </Badge>
      </div>

      {/* Teams Display */}
      <div className="flex-1 space-y-8">
        {/* Home Team */}
        <div className={`relative p-6 rounded-2xl transition-all duration-300 ${
          data.server === 'home' 
            ? 'bg-gradient-to-r from-green-600/30 to-green-500/20 border-2 border-green-400 shadow-lg shadow-green-400/20' 
            : 'bg-gradient-to-r from-slate-700/30 to-slate-600/20 border-2 border-slate-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-white mb-2">{data.homeTeam.shortName}</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-blue-300">Sets: {data.homeTeam.sets}</span>
                {data.server === 'home' && (
                  <Badge className="bg-green-500 text-white">SERVING</Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold text-white mb-2">{data.homeTeam.score}</div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => updateScore('homeTeam', false)} variant="outline">
                  <Minus className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => updateScore('homeTeam', true)} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* VS Divider */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4">
            <div className="h-px bg-blue-400 w-16"></div>
            <span className="text-2xl font-bold text-blue-300">VS</span>
            <div className="h-px bg-blue-400 w-16"></div>
          </div>
          <Button 
            onClick={toggleServer} 
            variant="ghost" 
            className="mt-2 text-xs text-blue-300 hover:text-white"
          >
            Switch Server
          </Button>
        </div>

        {/* Away Team */}
        <div className={`relative p-6 rounded-2xl transition-all duration-300 ${
          data.server === 'away' 
            ? 'bg-gradient-to-r from-green-600/30 to-green-500/20 border-2 border-green-400 shadow-lg shadow-green-400/20' 
            : 'bg-gradient-to-r from-slate-700/30 to-slate-600/20 border-2 border-slate-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-white mb-2">{data.awayTeam.shortName}</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-blue-300">Sets: {data.awayTeam.sets}</span>
                {data.server === 'away' && (
                  <Badge className="bg-green-500 text-white">SERVING</Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold text-white mb-2">{data.awayTeam.score}</div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => updateScore('awayTeam', false)} variant="outline">
                  <Minus className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => updateScore('awayTeam', true)} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Set Controls */}
      <div className="mt-6 flex justify-center space-x-4">
        <div className="text-center">
          <div className="text-sm text-blue-300 mb-2">{data.homeTeam.shortName} Sets</div>
          <div className="flex space-x-2">
            <Button size="sm" onClick={() => updateSets('homeTeam', false)} variant="outline">
              <Minus className="h-3 w-3" />
            </Button>
            <Button size="sm" onClick={() => updateSets('homeTeam', true)} variant="outline">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-blue-300 mb-2">{data.awayTeam.shortName} Sets</div>
          <div className="flex space-x-2">
            <Button size="sm" onClick={() => updateSets('awayTeam', false)} variant="outline">
              <Minus className="h-3 w-3" />
            </Button>
            <Button size="sm" onClick={() => updateSets('awayTeam', true)} variant="outline">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtDisplay;
