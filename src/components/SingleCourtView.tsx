import React from "react";
import { useParams } from "react-router-dom";
import { useMatchInfo } from "../hooks/useMatchInfo";
import { useCourtScore } from "../hooks/useCourtScore";
import { useOverrideNames } from "../hooks/useOverrideNames"; // přidáno
import shuttlecock from "../../assets/shuttlecock.png";

const SingleCourtView: React.FC = () => {
    const { courtId } = useParams<{ courtId: string }>();
    const { score, loading } = useCourtScore(courtId ?? "");
    const { matchInfo, loading: loadingMatch } = useMatchInfo();
    const { overrideNames, loading: loadingOverride } = useOverrideNames(courtId ?? ""); // přidáno

    if (!courtId || loading || loadingMatch || loadingOverride || !matchInfo) return null;

    const teamAName = overrideNames.teamANameOverride?.trim() || matchInfo.teamAName;
    const teamBName = overrideNames.teamBNameOverride?.trim() || matchInfo.teamBName;

    return (
        <div className="w-full h-screen bg-black text-white flex flex-col justify-center items-center px-6">
            {/* Past sets */}
            {score.pastSets.length > 0 && (
                <div className="text-yellow-300 text-7xl font-bold mb-10 tracking-wider flex flex-wrap gap-4 justify-center">
                    {score.pastSets.map((s, i) => (
                        <div
                            key={i}
                            className="px-4 py-2 bg-white/10 rounded-xl border border-yellow-300 shadow-md"
                        >
                            {s.teamA}:{s.teamB}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-row justify-center items-center w-full max-w-7xl gap-20">
                {/* Team A */}
                <div
                    className={`flex flex-col items-center border-4 px-2 py-8 rounded-3xl w-full max-w-md transition-all duration-300 ${
                        score.server === "home"
                            ? "border-white shadow-lg shadow-white/20 bg-white/10"
                            : "border-white/30 bg-blue-900/40"
                    }`}
                >
                    <h2 className="text-4xl sm:text-6xl font-extrabold mb-8 text-center">
                        {teamAName}
                    </h2>
                    <div className="text-9xl sm:text-9xl font-extrabold mb-6">{score.teamA}</div>
                    {score.server === "home" && (
                        <img src={shuttlecock} alt="servis" className="w-8 h-8 sm:w-10 sm:h-10" />
                    )}
                </div>

                {/* VS separator */}
                <div className="text-3xl sm:text-5xl font-bold text-muted-foreground select-none">vs</div>

                {/* Team B */}
                <div
                    className={`flex flex-col items-center border-4 px-2 py-8 rounded-3xl w-full max-w-md transition-all duration-300 ${
                        score.server === "away"
                            ? "border-white shadow-lg shadow-white/20 bg-white/10"
                            : "border-white/30 bg-blue-900/40"
                    }`}
                >
                    <h2 className="text-4xl sm:text-6xl font-extrabold mb-8 text-center">
                        {teamBName}
                    </h2>
                    <div className="text-9xl sm:text-9xl font-extrabold mb-6">{score.teamB}</div>
                    {score.server === "away" && (
                        <img src={shuttlecock} alt="servis" className="w-8 h-8 sm:w-10 sm:h-10" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SingleCourtView;
