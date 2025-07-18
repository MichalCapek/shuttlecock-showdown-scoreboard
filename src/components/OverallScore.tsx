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
        <div className="w-full px-6 sm:px-4 py-4 sm:py-6">
            {/* Mobilní zobrazení */}
            <div className="flex flex-col sm:hidden space-y-6">
                {/* Home */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
                            <img src={homeTeamLogo} alt="Home Team Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="text-white text-base font-bold">{homeTeam}</div>
                    </div>
                    <div className="text-white text-4xl font-black drop-shadow-lg">{homeScore}</div>
                </div>

                {/* Away */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
                            <img src={awayLogoUrl} alt="Away Team Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="text-white text-base font-bold">{awayTeam}</div>
                    </div>
                    <div className="text-white text-4xl font-black drop-shadow-lg">{awayScore}</div>
                </div>
            </div>


            {/* Desktop zobrazení */}
            <div className="hidden sm:flex items-center justify-center space-x-12">
                {/* Home */}
                <div className="flex items-center space-x-6">
                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg p-3">
                        <img src={homeTeamLogo} alt="Home Team Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-white text-2xl font-semibold">{homeTeam}</div>
                    <div className="text-white text-9xl font-black drop-shadow-lg">{homeScore}</div>
                </div>

                {/* VS */}
                <div className="text-white text-2xl font-bold opacity-80">VS</div>

                {/* Away */}
                <div className="flex items-center space-x-6">
                    <div className="text-white text-9xl font-black drop-shadow-lg">{awayScore}</div>
                    <div className="text-white text-2xl font-semibold">{awayTeam}</div>
                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg p-3">
                        <img src={awayLogoUrl} alt="Away Team Logo" className="w-full h-full object-contain" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverallScore;
