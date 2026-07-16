import type { CourtData } from "@/types";
import { TeamScoreBox } from "@/components/TeamScoreBox";
import { cn } from "@/lib/utils";

interface CourtDisplayProps {
    courtNumber: number;
    data: CourtData;
}

const CourtDisplay = ({ courtNumber, data }: CourtDisplayProps) => {
    const accent = courtNumber === 1 ? "blue" : "red";

    return (
        <div className="flex h-full min-h-0 flex-col px-2 py-2 sm:px-3 sm:py-3">
            <div className="mb-1 flex shrink-0 flex-col gap-1 sm:mb-2">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <span
                        className={cn(
                            "shrink-0 text-xs font-bold uppercase tracking-wider sm:text-sm md:text-base",
                            accent === "blue" ? "text-sky-300" : "text-red-300"
                        )}
                    >
                        Kurt {courtNumber}
                    </span>
                    <span className="text-xs text-white/50 sm:text-sm md:text-base">
                        Set {data.currentSet}
                    </span>
                </div>

                <div className="scoreboard-past-sets-slot flex flex-wrap items-center gap-2 sm:gap-3">
                    {data.pastSets?.map((set, index) => (
                        <span
                            key={index}
                            className="scoreboard-tv-past-set rounded-lg border border-white/20 bg-white/10 px-2 py-1 sm:px-3 sm:py-1.5"
                        >
                            {set.teamA}:{set.teamB}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-row items-stretch gap-1 sm:gap-2 md:gap-3">
                <TeamScoreBox team={data.homeTeam} isServer={data.server === "home"} accent={accent} />
                <TeamScoreBox team={data.awayTeam} isServer={data.server === "away"} accent={accent} />
            </div>
        </div>
    );
};

export default CourtDisplay;
