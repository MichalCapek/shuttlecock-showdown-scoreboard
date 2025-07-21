import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMatchInfo } from "../hooks/useMatchInfo";
import { useCourtScore } from "../hooks/useCourtScore";
import shuttlecock from "../../assets/shuttlecock.png";

const StreamOverlay: React.FC = () => {
    const { courtId } = useParams<{ courtId: string }>();
    const { matchInfo, loading: loadingMatch } = useMatchInfo();
    const { score, loading: loadingScore } = useCourtScore(courtId ?? "");

    const [prevScores, setPrevScores] = useState<{ teamA: number[]; teamB: number[] }>({
        teamA: [],
        teamB: [],
    });

    useEffect(() => {
        const currentSets = [...score.pastSets, { teamA: score.teamA, teamB: score.teamB }];
        setPrevScores({
            teamA: currentSets.map((s) => s.teamA),
            teamB: currentSets.map((s) => s.teamB),
        });
    }, [score]);

    useEffect(() => {
        document.body.classList.add("transparent-overlay");
        return () => {
            document.body.classList.remove("transparent-overlay");
        };
    }, []);

    if (!courtId || loadingMatch || loadingScore || !matchInfo) return null;

    const totalSets = [...score.pastSets, { teamA: score.teamA, teamB: score.teamB }];
    const maxTeamNameLength = Math.max(
        matchInfo.teamAName.length,
        matchInfo.teamBName.length
    );
    const nameColumnWidth = Math.max(160, maxTeamNameLength * 9);

    const getAnimationClass = (value: number, index: number, prev: number[]) => {
        if (prev[index] !== undefined && value > prev[index]) {
            return "animate-scoreChange";
        }
        return "";
    };

    const renderRow = (
        name: string,
        scores: number[],
        isServing: boolean,
        prevScores: number[]
    ) => {
        return (
            <>
                <div className="flex items-center" style={{ minWidth: nameColumnWidth }}>
                    <span className="truncate">{name}</span>
                </div>

                {scores.map((s, i) => (
                    <div
                        key={i}
                        className={`min-w-[32px] px-2 py-1 text-center rounded-md text-lg transition-all duration-300
                            ${i === scores.length - 1 ? "bg-blue-400 font-bold" : "bg-blue-700"}
                            ${getAnimationClass(s, i, prevScores)}`}
                    >
                        {s}
                    </div>
                ))}

                <div className="flex justify-center items-center w-5">
                    {isServing && (
                        <img
                            src={shuttlecock}
                            alt="server"
                            className="w-5 h-5"
                            draggable={false}
                        />
                    )}
                </div>
            </>
        );
    };

    const setScoresA = totalSets.map((s) => s.teamA);
    const setScoresB = totalSets.map((s) => s.teamB);

    return (
        <>
            <style>
                {`
                html, body {
                    background: transparent !important;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                }

                @keyframes scoreChange {
                    0% { background-color: #facc15; color: #000; }
                    100% { background-color: inherit; color: inherit; }
                }

                .animate-scoreChange {
                    animation: scoreChange 0.5s ease-in-out;
                }
                `}
            </style>

            <div className="fixed top-4 left-4 bg-[#061B40] text-white rounded-xl px-6 py-3 shadow-xl z-50 font-bold text-lg scale-150 origin-top-left">
                <div
                    className="grid gap-y-2 items-center"
                    style={{
                        gridTemplateColumns: `minmax(${nameColumnWidth}px, auto) repeat(${totalSets.length}, minmax(28px, auto)) 20px`,
                        gap: "0.75rem",
                    }}
                >
                    {renderRow(matchInfo.teamAName, setScoresA, score.server === "home", prevScores.teamA)}
                    {renderRow(matchInfo.teamBName, setScoresB, score.server === "away", prevScores.teamB)}
                </div>
            </div>
        </>
    );
};

export default StreamOverlay;
