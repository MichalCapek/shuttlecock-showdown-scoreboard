import { useParams } from "react-router-dom";
import { LoadingScreen } from "@/components/LoadingScreen";
import NotFound from "@/pages/NotFound";
import { useCourtViewData } from "@/hooks/useCourtViewData";
import { isCourtId, type CourtId } from "@/lib/courts";
import shuttlecock from "../../assets/shuttlecock.png";
import { cn } from "@/lib/utils";

function CourtTeamCard({
    name,
    score,
    isServer,
    accent,
}: {
    name: string;
    score: number;
    isServer: boolean;
    accent: "blue" | "red";
}) {
    return (
        <div
            className={cn(
                "court-view-team-card flex w-full max-w-2xl flex-1 flex-col overflow-hidden rounded-xl border-2 sm:rounded-2xl",
                isServer
                    ? cn(
                          "border-white shadow-[0_0_32px_rgba(255,255,255,0.2)]",
                          accent === "blue" ? "bg-brand-blue/50" : "bg-brand-red/50"
                      )
                    : "border-white/20 bg-black/20"
            )}
        >
            <div className="flex min-h-0 flex-1 flex-col items-center px-3 py-5 text-center xs:px-4 xs:py-6 sm:px-6 sm:py-8">
                <p className="court-view-team-name mb-3 w-full shrink-0 break-words xs:mb-4 sm:mb-6">
                    {name}
                </p>

                <div className="flex flex-1 flex-col items-center justify-center gap-[clamp(1.25rem,5vmin,3rem)]">
                    <div
                        className={cn(
                            "court-view-score shrink-0",
                            isServer && "scoreboard-tv-court-score--serving"
                        )}
                    >
                        {score}
                    </div>

                    <div className="court-view-service-slot scoreboard-service-slot flex w-full shrink-0 items-center justify-center">
                        {isServer && (
                            <div
                                className={cn(
                                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 sm:gap-2 sm:px-3 sm:py-1.5",
                                    accent === "blue" ? "bg-brand-blue" : "bg-brand-red"
                                )}
                            >
                                <img
                                    src={shuttlecock}
                                    alt="servis"
                                    className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
                                    draggable={false}
                                />
                                <span className="court-view-service-badge font-bold uppercase tracking-wider text-white">
                                    Servis
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SingleCourtViewContent({ courtId }: { courtId: CourtId }) {
    const { score, teamAName, teamBName, isReady } = useCourtViewData(courtId);

    if (!isReady) {
        return <LoadingScreen variant="scoreboard" />;
    }

    return (
        <div className="scoreboard-arena court-view flex min-h-dvh w-full flex-col text-white">
            <div className="h-0.5 shrink-0 bg-gradient-to-r from-brand-blue via-white/40 to-brand-red" />

            <div className="flex flex-1 flex-col items-center justify-center px-4 py-6 xs:px-6 sm:py-8">
                {score.pastSets.length > 0 && (
                    <div className="mb-6 flex max-w-full flex-wrap justify-center gap-2 xs:mb-8 xs:gap-3 sm:mb-10 sm:gap-4">
                        {score.pastSets.map((s, i) => (
                            <div
                                key={i}
                                className="scoreboard-tv-past-set rounded-lg border border-white/20 bg-white/10 px-2 py-1 xs:rounded-xl xs:px-3 xs:py-1.5 sm:px-4 sm:py-2"
                            >
                                {s.teamA}:{s.teamB}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex w-full max-w-7xl flex-col items-stretch justify-center gap-4 xs:gap-6 sm:flex-row sm:items-center sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20">
                    <CourtTeamCard
                        name={teamAName}
                        score={score.teamA}
                        isServer={score.server === "home"}
                        accent="blue"
                    />
                    <span className="court-view-vs shrink-0 self-center select-none">vs</span>
                    <CourtTeamCard
                        name={teamBName}
                        score={score.teamB}
                        isServer={score.server === "away"}
                        accent="red"
                    />
                </div>
            </div>
        </div>
    );
}

export default function SingleCourtView() {
    const { courtId } = useParams();

    if (!isCourtId(courtId)) {
        return <NotFound />;
    }

    return <SingleCourtViewContent courtId={courtId} />;
}
