import type { CourtData, CourtScore, MatchInfo, OverrideNames, PastSet } from "@/types";

export function resolveTeamName(
    team: "A" | "B",
    matchInfo: Pick<MatchInfo, "teamAName" | "teamBName">,
    overrides?: Pick<OverrideNames, "teamANameOverride" | "teamBNameOverride">
): string {
    const override = team === "A" ? overrides?.teamANameOverride : overrides?.teamBNameOverride;
    const defaultName = team === "A" ? matchInfo.teamAName : matchInfo.teamBName;
    return override?.trim() || defaultName;
}

/** Past completed sets plus the current in-progress set scores. */
export function getSetHistory(
    score: Pick<CourtScore, "pastSets" | "teamA" | "teamB">
): PastSet[] {
    return [...score.pastSets, { teamA: score.teamA, teamB: score.teamB }];
}

export function computeEndSetUpdate(score: CourtScore): Partial<CourtScore> {
    const pastSets = getSetHistory(score);
    const setsA = score.teamA > score.teamB ? score.setsA + 1 : score.setsA;
    const setsB = score.teamB > score.teamA ? score.setsB + 1 : score.setsB;

    return {
        teamA: 0,
        teamB: 0,
        setsA,
        setsB,
        currentSet: score.currentSet + 1,
        pastSets,
    };
}

export function buildCourtData(
    score: CourtScore,
    teamAName: string,
    teamBName: string,
    defaultServer: "home" | "away" = "home"
): CourtData {
    return {
        homeTeam: {
            shortName: teamAName,
            score: score.teamA ?? 0,
            sets: score.setsA ?? 0,
        },
        awayTeam: {
            shortName: teamBName,
            score: score.teamB ?? 0,
            sets: score.setsB ?? 0,
        },
        currentSet: score.currentSet ?? 1,
        server: score.server ?? defaultServer,
        pastSets: score.pastSets ?? [],
    };
}
