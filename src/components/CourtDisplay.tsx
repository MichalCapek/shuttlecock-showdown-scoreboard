import React from 'react';
import { Badge } from '@/components/ui/badge';
import ShuttlecockIcon from '../../assets/shuttlecock.png';

interface TeamData {
    shortName: string;
    score: number;
    sets: number;
}

interface CourtData {
    homeTeam: TeamData;
    awayTeam: TeamData;
    currentSet: number;
    server: "home" | "away";
    pastSets?: { teamA: number; teamB: number }[];
}

interface CourtDisplayProps {
    courtNumber: number;
    data: CourtData;
}

const CourtDisplay: React.FC<CourtDisplayProps> = ({ courtNumber, data }) => {
    return (
        <div className="h-full flex flex-col py-6">
            <div className="text-center mb-4">
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">KURT {courtNumber}</h2>
                <div className="text-white/90 text-lg sm:text-2xl font-medium mt-2 min-h-[1.5rem] sm:min-h-[2rem]">
                    {data.pastSets?.length > 0
                        ? data.pastSets.map((set) => `${set.teamA}:${set.teamB}`).join(', ')
                        : null}
                </div>
            </div>

            {/* Mobilní layout */}
            <div className="flex sm:hidden flex-row items-center justify-center gap-4 px-2">
                {[['home', data.homeTeam], ['away', data.awayTeam]].map(([side, team]) => {
                    const isServer = data.server === side;
                    return (
                        <div
                            key={side}
                            className={`p-2 rounded-xl w-full text-left border-2 ${
                                isServer ? 'border-white shadow-lg shadow-white/20' : 'border-white/30'
                            }`}
                            style={{
                                backgroundColor: isServer ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 74, 144, 0.3)',
                            }}
                        >
                            <div className="flex flex-row justify-between items-center min-h-[5.5rem] px-2">
                                <div className="text-white text-base font-bold">{team.shortName}</div>
                                <div className="text-4xl font-bold text-white">{team.score}</div>
                            </div>
                            <div className="flex justify-center min-h-[1.5rem] mt-1">
                                {isServer && (
                                    <img
                                        src={ShuttlecockIcon}
                                        alt="servis"
                                        className="w-5 h-5 opacity-80"
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop layout */}
            <div className="hidden sm:flex flex-1 flex-row items-center justify-center gap-12">
                {/* Home team box */}
                <div
                    className={`p-6 rounded-2xl border-4 transition-all duration-300 w-full max-w-xs ${
                        data.server === 'home' ? 'border-white shadow-lg shadow-white/20' : 'border-white/30'
                    }`}
                    style={{
                        backgroundColor: data.server === 'home' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 74, 144, 0.3)',
                    }}
                >
                    <div className="flex flex-col items-center">
                        <div className="text-center min-h-[10rem] flex flex-col justify-center">
                            <h3 className="text-4xl font-bold text-white mb-6">{data.homeTeam.shortName}</h3>
                            <div className="text-8xl font-bold text-white mb-6">{data.homeTeam.score}</div>
                        </div>
                        <div className="min-h-[3rem] flex items-center justify-center">
                            {data.server === 'home' && (
                                <Badge className="text-white text-lg px-4 py-2 bg-destructive">
                                    SERVIS
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* "vs" text */}
                <div className="text-center">
                    <span className="text-2xl font-bold text-muted-foreground">vs</span>
                </div>

                {/* Away team box */}
                <div
                    className={`p-6 rounded-2xl border-4 transition-all duration-300 w-full max-w-xs ${
                        data.server === 'away' ? 'border-white shadow-lg shadow-white/20' : 'border-white/30'
                    }`}
                    style={{
                        backgroundColor: data.server === 'away' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 74, 144, 0.3)',
                    }}
                >
                    <div className="flex flex-col items-center">
                        <div className="text-center min-h-[10rem] flex flex-col justify-center">
                            <h3 className="text-4xl font-bold text-white mb-6">{data.awayTeam.shortName}</h3>
                            <div className="text-8xl font-bold text-white mb-6">{data.awayTeam.score}</div>
                        </div>
                        <div className="min-h-[3rem] flex items-center justify-center">
                            {data.server === 'away' && (
                                <Badge className="text-white text-lg px-4 py-2" style={{ backgroundColor: '#E3161B' }}>
                                    SERVIS
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourtDisplay;
