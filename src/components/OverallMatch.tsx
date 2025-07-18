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

    updateTime();
    const interval = setInterval(updateTime, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center w-full px-4 sm:px-6 py-2 sm:py-4">
        {/* Mobilní layout */}
        <div className="flex sm:hidden w-full justify-center items-center space-x-3">
          <Trophy className="h-5 w-5" style={{ color: '#E3161B' }} />
          <h1 className="text-center text-base font-bold text-white drop-shadow-md">
            {data.title} – {data.round}
          </h1>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:flex items-center space-x-4">
          <Trophy className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: '#E3161B' }} />
          <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
            {data.title} – {data.round}
          </h1>
        </div>

        {/* Čas – zobrazit jen na desktopu */}
        <h1 className="hidden sm:block text-xl sm:text-2xl font-bold text-white drop-shadow-md">
          {currentTime}
        </h1>
      </div>
  );
};

export default OverallMatch;
