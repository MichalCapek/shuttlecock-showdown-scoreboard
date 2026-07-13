import CourtDisplay from "../components/CourtDisplay";
import OverallMatch from "../components/OverallMatch";
import OverallScore from "../components/OverallScore";
import SponsorArea from "../components/SponsorArea";
import { LoadingScreen } from "../components/LoadingScreen";
import { useCourtScore } from "../hooks/useCourtScore";
import { useMatchInfo } from "../hooks/useMatchInfo";
import { useOverallScore } from "@/hooks/useOverallScore";
import { COURT_IDS, BRAND_COLORS } from "@/constants";
import type { CourtData } from "@/types";

const Index = () => {
    const court1 = useCourtScore(COURT_IDS.COURT_1);
    const court2 = useCourtScore(COURT_IDS.COURT_2);
    const { overallScoreA, overallScoreB, loading: loadingOverall } = useOverallScore();
    const { matchInfo, loading } = useMatchInfo();

    const isLoading =
        loading ||
        loadingOverall ||
        !matchInfo?.teamAName ||
        !matchInfo?.teamBName ||
        court1.loading ||
        court2.loading ||
        overallScoreA === null ||
        overallScoreB === null;

    if (isLoading) {
        return <LoadingScreen />;
    }

    const teamAName = matchInfo.teamAName;
    const teamBName = matchInfo.teamBName;

    const createCourtData = (
        courtScore: typeof court1.score,
        defaultServer: "home" | "away"
    ): CourtData => ({
        homeTeam: {
            shortName: teamAName,
            score: courtScore.teamA ?? 0,
            sets: courtScore.setsA ?? 0,
        },
        awayTeam: {
            shortName: teamBName,
            score: courtScore.teamB ?? 0,
            sets: courtScore.setsB ?? 0,
        },
        currentSet: courtScore.currentSet ?? 1,
        server: courtScore.server ?? defaultServer,
        pastSets: courtScore.pastSets ?? [],
    });

    const court1Data = createCourtData(court1.score, "home");
    const court2Data = createCourtData(court2.score, "away");

    const totalScoreTeamA = overallScoreA;
    const totalScoreTeamB = overallScoreB;

    return (
        <div
            className="w-full min-h-screen text-white flex flex-col bg-gradient-to-br from-brand-blue to-brand-red"
        >
            <div
                className="h-auto sm:h-16 flex items-center justify-center border-b-4 border-white/60"
                style={{ backgroundColor: BRAND_COLORS.BLUE_OVERLAY }}
            >
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

            <div
                className="border-b-4 border-white/80 shadow-2xl"
                style={{ backgroundColor: BRAND_COLORS.RED_OVERLAY }}
            >
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

            <div
                className="h-auto sm:h-16 border-t-4 border-white/60"
                style={{ backgroundColor: BRAND_COLORS.BLUE_OVERLAY }}
            >
                <SponsorArea />
            </div>
        </div>
    );
};

export default Index;
