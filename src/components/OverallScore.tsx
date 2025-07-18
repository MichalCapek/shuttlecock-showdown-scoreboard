import React from 'react';
import homeTeamLogo from '../../assets/BkBenatky_logo.png';
const logos = import.meta.glob('../../assets/*.*', { eager: true, as: 'url' });

interface OverallScoreProps {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    awayLogoFileName: string;
}

const OverallScore: React.FC<OverallScoreProps> = ({
                                                       homeTeam,
                                                       awayTeam,
                                                       homeScore,
                                                       awayScore,
                                                       awayLogoFileName,
                                                   }) => {
    const awayLogoPath = `../../assets/${awayLogoFileName}`;
    const awayLogoUrl = logos[awayLogoPath] || logos['../../assets/default.png'];

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-12 py-4 sm:py-6 px-6 sm:px-4 space-y-6 sm:space-y-0">
            {/* Home Team */}
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-center sm:space-x-6">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 sm:w-40 sm:h-40 bg-white rounded-full flex items-center justify-center shadow-lg p-2 sm:p-3">
                        <img src={homeTeamLogo} alt="Home Team Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-white text-lg sm:text-2xl font-semibold">{homeTeam}</div>
                </div>
                <div className="text-white text-6xl sm:text-9xl font-black drop-shadow-lg pr-2 sm:pr-0">{homeScore}</div>
            </div>

            {/* VS */}
            <div className="text-white text-base sm:text-2xl font-bold opacity-80">VS</div>

            {/* Away Team */}
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-center sm:space-x-6">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 sm:w-40 sm:h-40 bg-white rounded-full flex items-center justify-center shadow-lg p-2 sm:p-3">
                        <img src={awayLogoUrl} alt="Away Team Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-white text-lg sm:text-2xl font-semibold">{awayTeam}</div>
                </div>
                <div className="text-white text-6xl sm:text-9xl font-black drop-shadow-lg pr-2 sm:pr-0">{awayScore}</div>
            </div>
        </div>
    );
};

export default OverallScore;
