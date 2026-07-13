import { useScoreboardData } from "@/hooks/useScoreboardData";
import { buildCourtData, resolveTeamName } from "@/lib/scoreboard";
import CourtDisplay from "@/components/CourtDisplay";
import OverallMatch from "@/components/OverallMatch";
import OverallScore from "@/components/OverallScore";
import SponsorArea from "@/components/SponsorArea";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ScoreboardShell } from "@/components/ScoreboardShell";

const Index = () => {
    const { court1, court2, override1, override2, matchInfo, isLoading } = useScoreboardData();

    if (isLoading || !matchInfo) {
        return <LoadingScreen variant="scoreboard" />;
    }

    const { title, round, awayLogo, overallScoreA, overallScoreB } = matchInfo;

    const court1TeamA = resolveTeamName("A", matchInfo, override1.overrideNames);
    const court1TeamB = resolveTeamName("B", matchInfo, override1.overrideNames);
    const court2TeamA = resolveTeamName("A", matchInfo, override2.overrideNames);
    const court2TeamB = resolveTeamName("B", matchInfo, override2.overrideNames);

    const court1Data = buildCourtData(court1.score, court1TeamA, court1TeamB, "home");
    const court2Data = buildCourtData(court2.score, court2TeamA, court2TeamB, "away");

    return (
        <ScoreboardShell
            header={
                <OverallMatch title={title ?? "Turnaj"} round={round ?? "Finále"} />
            }
            overallScore={
                <OverallScore
                    homeTeam={matchInfo.teamAName}
                    awayTeam={matchInfo.teamBName}
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
