import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface OverallMatchProps {
  data: {
    title: string;
    round: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    court1Status: string;
    court2Status: string;
  };
}

const OverallMatch: React.FC<OverallMatchProps> = ({ data }) => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString('cs-CZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      setCurrentTime(formatted);
    };

    updateTime(); // inicializuj hned
    const interval = setInterval(updateTime, 60 * 1000); // aktualizace každou minutu
    return () => clearInterval(interval);
  }, []);

  return (
      <div className="flex justify-between items-center w-full px-6 py-4">
        {/* Match Info vlevo */}
        <div className="flex items-center space-x-4">
          <Trophy className="h-8 w-8" style={{ color: '#E3161B' }} />
          <h1 className="text-2xl font-bold text-white drop-shadow-md">
            {data.title} – {data.round}
          </h1>
        </div>

        {/* Datum a čas vpravo */}
        <h1 className="text-2xl font-bold text-white drop-shadow-md">
          {currentTime}
        </h1>
      </div>
  );
};

export default OverallMatch;
