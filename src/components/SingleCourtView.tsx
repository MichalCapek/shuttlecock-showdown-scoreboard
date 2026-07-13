import { useParams } from "react-router-dom";
import { LoadingScreen } from "@/components/LoadingScreen";
import NotFound from "@/pages/NotFound";
import { useCourtViewData } from "@/hooks/useCourtViewData";
import { isCourtId, type CourtId } from "@/lib/courts";
import shuttlecock from "../../assets/shuttlecock.png";

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
            className={`flex w-full max-w-md flex-col items-center rounded-3xl border-4 px-2 py-8 transition-all duration-300 ${
                isServer
                    ? "border-white bg-white/10 shadow-lg shadow-white/20"
                    : "border-white/30 bg-blue-900/40"
            }`}
        >
            <h2 className="mb-8 text-center text-4xl font-extrabold sm:text-6xl">{name}</h2>
            <div className="mb-6 text-9xl font-extrabold">{score}</div>
            {isServer && (
                <img src={shuttlecock} alt="servis" className="h-8 w-8 sm:h-10 sm:w-10" />
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
        <div className="flex h-screen w-full flex-col items-center justify-center bg-black px-6 text-white">
            {score.pastSets.length > 0 && (
                <div className="mb-10 flex flex-wrap justify-center gap-4 text-7xl font-bold tracking-wider text-yellow-300">
                    {score.pastSets.map((s, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-yellow-300 bg-white/10 px-4 py-2 shadow-md"
                        >
                            {s.teamA}:{s.teamB}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex w-full max-w-7xl flex-row items-center justify-center gap-20">
                <CourtTeamCard
                    name={teamAName}
                    score={score.teamA}
                    isServer={score.server === "home"}
                />
                <div className="select-none text-3xl font-bold text-white/60 sm:text-5xl">vs</div>
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
