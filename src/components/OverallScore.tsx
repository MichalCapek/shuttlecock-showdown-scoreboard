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
                                                       awayLogoFileName
                                                   }) => {
    const awayLogoPath = `../../assets/${awayLogoFileName}`;
    const awayLogoUrl = logos[awayLogoPath] || logos['../../assets/default.png'];

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-12 py-4 sm:py-6 px-4">
            {/* Home Team */}
            <div className="flex items-center space-x-4 sm:space-x-6 mb-4 sm:mb-0">
                <div className="w-24 h-24 sm:w-40 sm:h-40 bg-white rounded-full flex items-center justify-center shadow-lg p-2 sm:p-3">
                    <img src={homeTeamLogo} alt="Home Team Logo" className="w-full h-full object-contain" />
                </div>
                <div className="text-center">
                    <div className="text-lg sm:text-2xl font-semibold text-white mb-1 sm:mb-2">{homeTeam}</div>
                    <div className="text-6xl sm:text-9xl font-black text-white drop-shadow-lg">{homeScore}</div>
                </div>
            </div>

            {/* VS */}
            <div className="text-white text-xl sm:text-2xl font-bold opacity-90 mb-4 sm:mb-0">VS</div>

            {/* Away Team */}
            <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="text-center">
                    <div className="text-lg sm:text-2xl font-semibold text-white mb-1 sm:mb-2">{awayTeam}</div>
                    <div className="text-6xl sm:text-9xl font-black text-white drop-shadow-lg">{awayScore}</div>
                </div>
                <div className="w-24 h-24 sm:w-40 sm:h-40 bg-white rounded-full flex items-center justify-center shadow-lg p-2 sm:p-3">
                    <img src={awayLogoUrl} alt="Away Team Logo" className="w-full h-full object-contain" />
                </div>
            </div>
        </div>
    );
};

export default OverallScore;
