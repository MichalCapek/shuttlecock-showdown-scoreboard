import CourtDisplay from "@/components/CourtDisplay";
import OverallMatch from "@/components/OverallMatch";
import OverallScore from "@/components/OverallScore";
import SponsorArea from "@/components/SponsorArea";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ScoreboardShell } from "@/components/ScoreboardShell";
import { useScoreboardData } from "@/hooks/useScoreboardData";
import { buildCourtData } from "@/lib/scoreboard";

const Index = () => {
    const { court1, court2, matchInfo, isLoading } = useScoreboardData();

    if (isLoading || !matchInfo) {
        return <LoadingScreen variant="scoreboard" />;
    }

    const { teamAName, teamBName, title, round, awayLogo, overallScoreA, overallScoreB } =
        matchInfo;

    const court1Data = buildCourtData(court1.score, teamAName, teamBName, "home");
    const court2Data = buildCourtData(court2.score, teamAName, teamBName, "away");

    return (
        <ScoreboardShell
            header={
                <OverallMatch title={title ?? "Turnaj"} round={round ?? "Finále"} />
            }
            overallScore={
                <OverallScore
                    homeTeam={teamAName}
                    awayTeam={teamBName}
                    homeScore={overallScoreA}
                    awayScore={overallScoreB}
                    awayLogoFileName={awayLogo ?? "default.png"}
                />
            }
            courtLeft={<CourtDisplay courtNumber={1} data={court1Data} />}
            courtRight={<CourtDisplay courtNumber={2} data={court2Data} />}
            footer={<SponsorArea />}
        />
    );
};

export default Index;
