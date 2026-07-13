import { useCourtScore } from "@/hooks/useCourtScore";
import { useMatchInfo } from "@/hooks/useMatchInfo";
import { COURT_IDS } from "@/constants";

export const useScoreboardData = () => {
    const court1 = useCourtScore(COURT_IDS.COURT_1);
    const court2 = useCourtScore(COURT_IDS.COURT_2);
    const { matchInfo, loading: matchLoading, error: matchError } = useMatchInfo();

    const courtsLoading = court1.loading || court2.loading;
    const isReady =
        !matchLoading &&
        !courtsLoading &&
        matchInfo !== null &&
        Boolean(matchInfo.teamAName) &&
        Boolean(matchInfo.teamBName);

    return {
        court1,
        court2,
        matchInfo,
        isLoading: !isReady,
        error: matchError ?? court1.error ?? court2.error,
    };
};
