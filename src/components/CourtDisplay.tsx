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
        <div className="flex h-full min-h-0 flex-col py-3 xs:py-4 sm:py-5 md:py-6">
            <div className="mb-2 shrink-0 text-center sm:mb-3 md:mb-4">
                <h2 className="mb-0.5 text-xl font-bold text-white xs:text-2xl sm:text-3xl md:text-4xl">
                    KURT {courtNumber}
                </h2>
                <p className="text-xs font-medium uppercase tracking-wider text-white/70 xs:text-sm sm:text-base">
                    Set {data.currentSet}
                </p>
                <div className="mt-1 min-h-[1.25rem] text-sm font-medium text-white/90 xs:min-h-[1.5rem] xs:text-base sm:mt-2 sm:min-h-[2rem] sm:text-lg md:text-xl lg:text-2xl">
                    {pastSetsDisplay}
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-row items-center justify-center gap-2 px-1 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12">
                <TeamScoreBox team={data.homeTeam} isServer={data.server === "home"} />
                <span className="shrink-0 select-none text-base font-bold text-white/60 xs:text-lg sm:text-xl md:text-2xl">
                    vs
                </span>
                <TeamScoreBox team={data.awayTeam} isServer={data.server === "away"} />
            </div>
        </div>
    );
};

export default CourtDisplay;
