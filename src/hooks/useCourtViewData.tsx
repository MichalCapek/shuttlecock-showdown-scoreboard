import { useCourtScore } from "@/hooks/useCourtScore";
import { useMatchInfo } from "@/hooks/useMatchInfo";
import { useOverrideNames } from "@/hooks/useOverrideNames";
import { resolveTeamName } from "@/lib/scoreboard";

export function useCourtViewData(courtId: string) {
    const { score, loading: scoreLoading, error: scoreError } = useCourtScore(courtId);
    const { matchInfo, loading: matchLoading, error: matchError } = useMatchInfo();
    const {
        overrideNames,
        loading: overrideLoading,
        error: overrideError,
    } = useOverrideNames(courtId);

    const isLoading = scoreLoading || matchLoading || overrideLoading;
    const isReady = !isLoading && matchInfo !== null;

    const teamAName = matchInfo ? resolveTeamName("A", matchInfo, overrideNames) : "";
    const teamBName = matchInfo ? resolveTeamName("B", matchInfo, overrideNames) : "";

    return {
        score,
        matchInfo,
        overrideNames,
        teamAName,
        teamBName,
        isLoading,
        isReady,
        error: matchError ?? scoreError ?? overrideError,
    };
}
