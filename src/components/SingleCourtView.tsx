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
}: {
    name: string;
    score: number;
    isServer: boolean;
}) {
    return (
        <div
            className={cn(
                "flex w-full max-w-md flex-col items-center rounded-2xl border-4 px-3 py-5 transition-all duration-300 xs:rounded-3xl xs:px-4 xs:py-6 sm:py-8",
                isServer
                    ? "border-white bg-white/10 shadow-lg shadow-white/20"
                    : "border-white/30 bg-blue-900/40"
            )}
        >
            <h2 className="mb-4 w-full break-words text-center text-2xl font-extrabold leading-tight xs:mb-6 xs:text-3xl sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl">
                {name}
            </h2>
            <div className="mb-4 text-[clamp(3.5rem,18vw,8rem)] font-extrabold tabular-nums leading-none xs:mb-6">
                {score}
            </div>
            {isServer && (
                <img
                    src={shuttlecock}
                    alt="servis"
                    className="h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10"
                />
            )}
        </div>
    );
}

function SingleCourtViewContent({ courtId }: { courtId: CourtId }) {
    const { score, teamAName, teamBName, isReady } = useCourtViewData(courtId);

    if (!isReady) {
        return <LoadingScreen variant="scoreboard" />;
    }

    return (
        <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-black px-4 py-6 text-white xs:px-6">
            {score.pastSets.length > 0 && (
                <div className="mb-6 flex max-w-full flex-wrap justify-center gap-2 xs:mb-8 xs:gap-3 sm:mb-10 sm:gap-4">
                    {score.pastSets.map((s, i) => (
                        <div
                            key={i}
                            className="rounded-lg border border-yellow-300 bg-white/10 px-2 py-1 text-xl font-bold tracking-wider text-yellow-300 shadow-md xs:rounded-xl xs:px-3 xs:py-1.5 xs:text-2xl sm:px-4 sm:py-2 sm:text-3xl md:text-4xl lg:text-5xl"
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
                />
                <div className="select-none self-center text-2xl font-bold text-white/60 xs:text-3xl sm:text-4xl md:text-5xl">
                    vs
                </div>
                <CourtTeamCard
                    name={teamBName}
                    score={score.teamB}
                    isServer={score.server === "away"}
                />
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
