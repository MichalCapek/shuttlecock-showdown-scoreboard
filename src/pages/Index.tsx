import React from "react";
import CourtDisplay from "../components/CourtDisplay";
import OverallMatch from "../components/OverallMatch";
import OverallScore from "../components/OverallScore";
import SponsorArea from "../components/SponsorArea";
import { useCourtScore } from "../hooks/useCourtScore";
import { useMatchInfo } from "../hooks/useMatchInfo";
import { useOverallScore } from "@/hooks/useOverallScore.tsx";

const Index = () => {
    const court1 = useCourtScore("court1");
    const court2 = useCourtScore("court2");
    const { overallScoreA, overallScoreB, loading: loadingOverall } = useOverallScore();
    const { matchInfo, loading } = useMatchInfo();

    if (
        loading ||
        loadingOverall ||
        !matchInfo?.teamAName ||
        !matchInfo?.teamBName ||
        court1.loading ||
        court2.loading ||
        overallScoreA === null ||
        overallScoreB === null
    ) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center text-2xl">
                Načítám data...
            </div>
        );
    }

    const teamAName = matchInfo.teamAName;
    const teamBName = matchInfo.teamBName;

    const court1Data = {
        homeTeam: {
            shortName: teamAName,
            score: court1.score.teamA ?? 0,
            sets: court1.score.setsA ?? 0,
        },
        awayTeam: {
            shortName: teamBName,
            score: court1.score.teamB ?? 0,
            sets: court1.score.setsB ?? 0,
        },
        currentSet: court1.score.currentSet ?? 1,
        server: court1.score.server ?? "home",
        pastSets: court1.score.pastSets ?? [],
    };

    const court2Data = {
        homeTeam: {
            shortName: teamAName,
            score: court2.score.teamA ?? 0,
            sets: court2.score.setsA ?? 0,
        },
        awayTeam: {
            shortName: teamBName,
            score: court2.score.teamB ?? 0,
            sets: court2.score.setsB ?? 0,
        },
        currentSet: court2.score.currentSet ?? 1,
        server: court2.score.server ?? "away",
        pastSets: court2.score.pastSets ?? [],
    };

    const totalScoreTeamA = overallScoreA;
    const totalScoreTeamB = overallScoreB;

    return (
        <div
            className="w-full h-screen text-white overflow-hidden flex flex-col"
            style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #004A90 0%, #E3161B 100%)" }}
        >
            <div className="h-auto sm:h-16 flex items-center justify-center border-b-4 border-white/60" style={{ backgroundColor: "rgba(0, 74, 144, 0.95)" }}>
                <OverallMatch
                    data={{
                        title: matchInfo.title ?? "Turnaj",
                        round: matchInfo.round ?? "Finále",
                        homeTeam: teamAName,
                        awayTeam: teamBName,
                        homeScore: totalScoreTeamA,
                        awayScore: totalScoreTeamB,
                    }}
                />
            </div>

            <div className="border-b-4 border-white/80 shadow-2xl" style={{ backgroundColor: "rgba(227, 22, 27, 0.95)" }}>
                <OverallScore
                    homeTeam={teamAName}
                    awayTeam={teamBName}
                    homeScore={totalScoreTeamA}
                    awayScore={totalScoreTeamB}
                    awayLogoFileName={matchInfo.awayLogo ?? "default.png"}
                />
            </div>

            <div className="flex-1 flex flex-col md:flex-row">
                <div className="flex-1 px-2 sm:px-6 border-b-4 md:border-b-0 md:border-r-4 border-white/60">
                    <CourtDisplay courtNumber={1} data={court1Data} />
                </div>
                <div className="flex-1 px-2 sm:px-6">
                    <CourtDisplay courtNumber={2} data={court2Data} />
                </div>
            </div>

            <div className="h-auto sm:h-16 border-t-4 border-white/60" style={{ backgroundColor: "rgba(0, 74, 144, 0.95)" }}>
                <SponsorArea />
            </div>
        </div>
    );
};

export default Index;
