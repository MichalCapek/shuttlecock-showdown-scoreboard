import ShuttlecockIcon from "../../assets/shuttlecock.png";
import type { TeamData } from "@/types";
import { cn } from "@/lib/utils";

interface TeamScoreBoxProps {
    team: TeamData;
    isServer: boolean;
    accent?: "blue" | "red";
}

export const TeamScoreBox = ({ team, isServer, accent = "blue" }: TeamScoreBoxProps) => {
    return (
        <div
            className={cn(
                "team-score-box flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border-2 sm:rounded-xl",
                isServer
                    ? cn(
                          "border-white shadow-[0_0_24px_rgba(255,255,255,0.2)]",
                          accent === "blue" ? "bg-brand-blue/50" : "bg-brand-red/50"
                      )
                    : "border-white/20 bg-black/20"
            )}
        >
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-1.5 py-2 text-center xs:px-2 sm:px-4 sm:py-4 md:px-5 md:py-5">
                <p className="scoreboard-tv-team-name-court mb-2 w-full shrink-0 break-words leading-tight sm:mb-3">
                    {team.shortName}
                </p>

                <div
                    className={cn(
                        "scoreboard-tv-court-score flex flex-1 items-center justify-center",
                        isServer && "scoreboard-tv-court-score--serving"
                    )}
                >
                    {team.score}
                </div>

                <div className="scoreboard-service-slot flex w-full shrink-0 items-center justify-center">
                    {isServer && (
                        <div
                            className={cn(
                                "flex items-center gap-1.5 rounded-md px-2 py-0.5 sm:gap-2 sm:px-2.5 sm:py-1",
                                accent === "blue" ? "bg-brand-blue" : "bg-brand-red"
                            )}
                        >
                            <img
                                src={ShuttlecockIcon}
                                alt="servis"
                                className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5"
                            />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white sm:text-xs md:text-sm">
                                Servis
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamScoreBox;
