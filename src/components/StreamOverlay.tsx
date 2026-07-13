import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { useCourtViewData } from "@/hooks/useCourtViewData";
import { isCourtId, type CourtId } from "@/lib/courts";
import { getSetHistory } from "@/lib/scoreboard";
import shuttlecock from "../../assets/shuttlecock.png";

function StreamScoreRow({
    name,
    scores,
    isServing,
    prevScores,
    nameColumnWidth,
}: {
    name: string;
    scores: number[];
    isServing: boolean;
    prevScores: number[];
    nameColumnWidth: number;
}) {
    const getAnimationClass = (value: number, index: number) => {
        if (prevScores[index] !== undefined && value > prevScores[index]) {
            return "animate-scoreChange";
        }
        return "";
    };

    return (
        <>
            <div className="flex items-center" style={{ minWidth: nameColumnWidth }}>
                <span className="truncate">{name}</span>
            </div>

            {scores.map((s, i) => (
                <div
                    key={i}
                    className={`min-w-[32px] rounded-md px-2 py-1 text-center text-lg transition-all duration-300
                        ${i === scores.length - 1 ? "bg-blue-400 font-bold" : "bg-blue-700"}
                        ${getAnimationClass(s, i)}`}
                >
                    {s}
                </div>
            ))}

            <div className="flex w-5 items-center justify-center">
                {isServing && (
                    <img
                        src={shuttlecock}
                        alt="server"
                        className="h-5 w-5"
                        draggable={false}
                    />
                )}
            </div>
        </>
    );
}

function StreamOverlayContent({ courtId }: { courtId: CourtId }) {
    const { score, matchInfo, teamAName, teamBName, isReady } = useCourtViewData(courtId);

    const [prevScores, setPrevScores] = useState<{ teamA: number[]; teamB: number[] }>({
        teamA: [],
        teamB: [],
    });

    useEffect(() => {
        const setHistory = getSetHistory(score);
        setPrevScores({
            teamA: setHistory.map((s) => s.teamA),
            teamB: setHistory.map((s) => s.teamB),
        });
    }, [score.pastSets, score.teamA, score.teamB]);

    useEffect(() => {
        document.body.classList.add("stream-overlay");
        return () => {
            document.body.classList.remove("stream-overlay");
        };
    }, []);

    if (!isReady || !matchInfo) {
        return null;
    }

    const totalSets = getSetHistory(score);
    const maxTeamNameLength = Math.max(teamAName.length, teamBName.length);
    const nameColumnWidth = Math.max(160, maxTeamNameLength * 9);
    const setScoresA = totalSets.map((s) => s.teamA);
    const setScoresB = totalSets.map((s) => s.teamB);

    return (
        <div className="fixed left-4 top-4 z-50 w-fit origin-top-left scale-150">
            <div className="relative z-10 rounded-xl bg-background px-6 py-3 text-lg font-bold text-white shadow-xl">
                <div
                    className="grid items-center gap-y-2"
                    style={{
                        gridTemplateColumns: `minmax(${nameColumnWidth}px, auto) repeat(${totalSets.length}, minmax(28px, auto)) 20px`,
                        gap: "0.75rem",
                    }}
                >
                    <StreamScoreRow
                        name={teamAName}
                        scores={setScoresA}
                        isServing={score.server === "home"}
                        prevScores={prevScores.teamA}
                        nameColumnWidth={nameColumnWidth}
                    />
                    <StreamScoreRow
                        name={teamBName}
                        scores={setScoresB}
                        isServing={score.server === "away"}
                        prevScores={prevScores.teamB}
                        nameColumnWidth={nameColumnWidth}
                    />
                </div>
            </div>
            <div className="relative z-0 -mt-3 w-fit whitespace-nowrap rounded-b-xl bg-blue-900 px-4 pb-2 pt-4 text-left text-base font-semibold text-white shadow-lg">
                Skóre utkání: {matchInfo.overallScoreA}:{matchInfo.overallScoreB}
            </div>
        </div>
    );
}

export default function StreamOverlay() {
    const { courtId } = useParams();

    if (!isCourtId(courtId)) {
        return <NotFound />;
    }

    return <StreamOverlayContent courtId={courtId} />;
}
