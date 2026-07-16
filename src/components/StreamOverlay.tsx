import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { useCourtViewData } from "@/hooks/useCourtViewData";
import { isCourtId, type CourtId } from "@/lib/courts";
import { getSetHistory } from "@/lib/scoreboard";
import { cn } from "@/lib/utils";
import shuttlecock from "../../assets/shuttlecock.png";

function SetScoreCell({
    score,
    isCurrent,
    isServing,
    accent,
    animate,
}: {
    score: number;
    isCurrent: boolean;
    isServing: boolean;
    accent: "blue" | "red";
    animate: boolean;
}) {
    if (!isCurrent) {
        return (
            <span
                className={cn(
                    "stream-overlay-score stream-overlay-set-past",
                    animate && "animate-scoreChange"
                )}
            >
                {score}
            </span>
        );
    }

    return (
        <span
            className={cn(
                "stream-overlay-score stream-overlay-set-current",
                accent === "blue"
                    ? "stream-overlay-set-current--blue"
                    : "stream-overlay-set-current--red",
                isServing && "stream-overlay-set-current--serving",
                animate && "animate-scoreChange"
            )}
        >
            {score}
        </span>
    );
}

function StreamScoreRow({
    name,
    scores,
    isServing,
    prevScores,
    nameColumnWidth,
    accent,
}: {
    name: string;
    scores: number[];
    isServing: boolean;
    prevScores: number[];
    nameColumnWidth: number;
    accent: "blue" | "red";
}) {
    const currentSetIndex = scores.length - 1;

    const getAnimationClass = (value: number, index: number) =>
        prevScores[index] !== undefined && value > prevScores[index];

    return (
        <>
            <div className="flex min-w-0 items-center" style={{ minWidth: nameColumnWidth }}>
                <span className="stream-overlay-team-name truncate">{name}</span>
            </div>

            {scores.map((s, i) => (
                <SetScoreCell
                    key={i}
                    score={s}
                    isCurrent={i === currentSetIndex}
                    isServing={isServing && i === currentSetIndex}
                    accent={accent}
                    animate={getAnimationClass(s, i)}
                />
            ))}

            <div className="flex w-5 items-center justify-center">
                {isServing && (
                    <img
                        src={shuttlecock}
                        alt="servis"
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

    const accent = courtId === "court1" ? "blue" : "red";
    const totalSets = getSetHistory(score);
    const maxTeamNameLength = Math.max(teamAName.length, teamBName.length);
    const nameColumnWidth = Math.max(160, maxTeamNameLength * 9);
    const setScoresA = totalSets.map((s) => s.teamA);
    const setScoresB = totalSets.map((s) => s.teamB);

    return (
        <div className="fixed left-4 top-4 z-50 w-fit text-white">
            <div className="stream-overlay-panel relative z-10 w-fit overflow-hidden rounded-xl">
                <div className="stream-overlay-rail" />

                <div className="px-4 py-3">
                    <div
                        className="grid items-center gap-y-2.5"
                        style={{
                            gridTemplateColumns: `minmax(${nameColumnWidth}px, auto) repeat(${totalSets.length}, minmax(2.25rem, auto)) 1.25rem`,
                            columnGap: "0.65rem",
                        }}
                    >
                        <StreamScoreRow
                            name={teamAName}
                            scores={setScoresA}
                            isServing={score.server === "home"}
                            prevScores={prevScores.teamA}
                            nameColumnWidth={nameColumnWidth}
                            accent={accent}
                        />
                        <StreamScoreRow
                            name={teamBName}
                            scores={setScoresB}
                            isServing={score.server === "away"}
                            prevScores={prevScores.teamB}
                            nameColumnWidth={nameColumnWidth}
                            accent={accent}
                        />
                    </div>
                </div>
            </div>

            <div className="stream-overlay-footer-tab">
                Skóre utkání:{" "}
                <span className="stream-overlay-score">
                    {matchInfo.overallScoreA}:{matchInfo.overallScoreB}
                </span>
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
