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
                {/* Týmové jméno */}
                <div className="flex items-center" style={{ minWidth: nameColumnWidth }}>
                    <span className="truncate">{name}</span>
                </div>

                {/* Skóre setů */}
                {scores.map((s, i) => (
                    <div
                        key={i}
                        className={`min-w-[26px] px-1 py-0.5 text-center rounded-md transition-all duration-300
                            ${i === scores.length - 1 ? "bg-blue-400 font-bold" : "bg-blue-700"}
                            ${getAnimationClass(s, i, prevScores)}`}
                    >
                        {s}
                    </div>
                ))}

                {/* Ikona servera */}
                <div className="flex justify-center items-center w-4">
                    {isServing && (
                        <img
                            src={shuttlecock}
                            alt="server"
                            className="w-4 h-4"
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
        <div className="fixed top-4 left-4 bg-[#061B40] text-white rounded-xl px-4 py-2 shadow-xl z-50 font-semibold text-sm">
            <style>
                {`
                @keyframes scoreChange {
                    0% { background-color: #facc15; color: #000; }
                    100% { background-color: inherit; color: inherit; }
                }
                .animate-scoreChange {
                    animation: scoreChange 0.5s ease-in-out;
                }
                `}
            </style>

            <div
                className="grid gap-y-1 items-center"
                style={{
                    gridTemplateColumns: `minmax(${nameColumnWidth}px, auto) repeat(${totalSets.length}, minmax(24px, auto)) 16px`,
                    gap: "0.5rem",
                }}
            >
                {renderRow(matchInfo.teamAName, setScoresA, score.server === "home", prevScores.teamA)}
                {renderRow(matchInfo.teamBName, setScoresB, score.server === "away", prevScores.teamB)}
            </div>
        </div>
    );
};

export default StreamOverlay;
