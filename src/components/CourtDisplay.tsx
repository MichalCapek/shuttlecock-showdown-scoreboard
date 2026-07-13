import type { CourtData } from "@/types";
import { TeamScoreBox } from "@/components/TeamScoreBox";

interface CourtDisplayProps {
    courtNumber: number;
    data: CourtData;
}

const CourtDisplay = ({ courtNumber, data }: CourtDisplayProps) => {
    const pastSetsDisplay = data.pastSets?.length
        ? data.pastSets.map((set) => `${set.teamA}:${set.teamB}`).join(", ")
        : null;

    return (
        <div className="flex h-full flex-col py-6">
            <div className="mb-4 text-center">
                <h2 className="mb-1 text-2xl font-bold text-white sm:text-4xl">
                    KURT {courtNumber}
                </h2>
                <p className="text-sm font-medium uppercase tracking-wider text-white/70 sm:text-base">
                    Set {data.currentSet}
                </p>
                <div className="mt-2 min-h-[1.5rem] text-lg font-medium text-white/90 sm:min-h-[2rem] sm:text-2xl">
                    {pastSetsDisplay}
                </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-4 px-2 sm:hidden">
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

            <div className="hidden flex-1 flex-row items-center justify-center gap-12 sm:flex">
                <TeamScoreBox
                    team={data.homeTeam}
                    isServer={data.server === "home"}
                />
                <span className="text-2xl font-bold text-white/60">vs</span>
                <TeamScoreBox
                    team={data.awayTeam}
                    isServer={data.server === "away"}
                />
            </div>
        </div>
    );
};

export default CourtDisplay;
