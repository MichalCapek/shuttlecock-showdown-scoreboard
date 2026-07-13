import { useCourtScore } from "@/hooks/useCourtScore";
import { useMatchInfo } from "@/hooks/useMatchInfo";
import { useOverrideNames } from "@/hooks/useOverrideNames";
import { COURT_IDS } from "@/constants";

export function useScoreboardData() {
    const court1 = useCourtScore(COURT_IDS.COURT_1);
    const court2 = useCourtScore(COURT_IDS.COURT_2);
    const override1 = useOverrideNames(COURT_IDS.COURT_1);
    const override2 = useOverrideNames(COURT_IDS.COURT_2);
    const { matchInfo, loading: matchLoading, error: matchError } = useMatchInfo();

    const courtsLoading = court1.loading || court2.loading;
    const overridesLoading = override1.loading || override2.loading;
    const isReady =
        !matchLoading &&
        !courtsLoading &&
        !overridesLoading &&
        matchInfo !== null &&
        Boolean(matchInfo.teamAName) &&
        Boolean(matchInfo.teamBName);

    return {
        court1,
        court2,
        override1,
        override2,
        matchInfo,
        isLoading: !isReady,
        error: matchError ?? court1.error ?? court2.error ?? override1.error ?? override2.error,
    };
}
