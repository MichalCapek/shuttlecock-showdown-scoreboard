import React from "react";
import type { CourtData } from "@/types";
import { TeamScoreBox } from "@/components/TeamScoreBox";

interface CourtDisplayProps {
    courtNumber: number;
    data: CourtData;
}

const CourtDisplay: React.FC<CourtDisplayProps> = ({ courtNumber, data }) => {
    const pastSetsDisplay = data.pastSets?.length
        ? data.pastSets.map((set) => `${set.teamA}:${set.teamB}`).join(", ")
        : null;

    return (
        <div className="h-full flex flex-col py-6">
            <div className="text-center mb-4">
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">
                    KURT {courtNumber}
                </h2>
                <div className="text-white/90 text-lg sm:text-2xl font-medium mt-2 min-h-[1.5rem] sm:min-h-[2rem]">
                    {pastSetsDisplay}
                </div>
            </div>

            {/* Mobile layout */}
            <div className="flex sm:hidden flex-row items-center justify-center gap-4 px-2">
                <TeamScoreBox
                    team={data.homeTeam}
                    isServer={data.server === "home"}
                    isMobile
                />
                <TeamScoreBox
                    team={data.awayTeam}
                    isServer={data.server === "away"}
                    isMobile
                />
            </div>

            {/* Desktop layout */}
            <div className="hidden sm:flex flex-1 flex-row items-center justify-center gap-12">
                <TeamScoreBox
                    team={data.homeTeam}
                    isServer={data.server === "home"}
                />
                <div className="text-center">
                    <span className="text-2xl font-bold text-muted-foreground">vs</span>
                </div>
                <TeamScoreBox
                    team={data.awayTeam}
                    isServer={data.server === "away"}
                />
            </div>
        </div>
    );
};

export default CourtDisplay;
