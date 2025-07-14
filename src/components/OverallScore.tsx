import React from 'react';
import homeTeamLogo from '../../assets/BkBenatky_logo.png';
import awayTeamLogo from '../../assets/KLI_logo.png';

interface OverallScoreProps {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
}

const OverallScore: React.FC<OverallScoreProps> = ({ homeTeam, awayTeam, homeScore, awayScore }) => {
    return (
        <div className="flex items-center justify-center space-x-12 py-6">
            <div className="flex items-center space-x-6">
                {/* Home Team Logo */}
                <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg p-3">
                    <img
                        src={homeTeamLogo}
                        alt="Home Team Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="text-center self-center">
                    <div className="text-2xl font-semibold text-white mb-2">{homeTeam}</div>
                    <div className="text-9xl font-black text-white drop-shadow-lg">{homeScore}</div>
                </div>
            </div>

            <div className="flex flex-col items-center px-8">
                <div className="text-white text-xl font-bold opacity-90">VS</div>
            </div>

            <div className="flex items-center space-x-6">
                <div className="text-center self-center">
                    <div className="text-2xl font-semibold text-white mb-2">{awayTeam}</div>
                    <div className="text-9xl font-black text-white drop-shadow-lg">{awayScore}</div>
                </div>
                <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg p-3">
            <img
                src={awayTeamLogo}
                alt="Home Team Logo"
                className="w-full h-full object-contain"
            />
                </div>
            </div>
        </div>
    );
};

export default OverallScore;
