import type { CourtData, CourtScore } from "@/types";

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
