import type { CourtScore, MatchInfoWithOverallScore } from "@/types";

export function parseMatchDoc(data: Record<string, unknown>): MatchInfoWithOverallScore {
    return {
        teamAName: (data.teamAName as string) ?? "Tým A",
        teamBName: (data.teamBName as string) ?? "Tým B",
        title: (data.title as string) ?? "Zápas",
        round: (data.round as string) ?? "",
        overallScoreA: (data.overallScoreA as number) ?? 0,
        overallScoreB: (data.overallScoreB as number) ?? 0,
        awayLogo: (data.awayLogo as string) ?? "",
    };
}

export function parseCourtDoc(data: Record<string, unknown>): CourtScore {
    return {
        teamA: (data.teamA as number) ?? 0,
        teamB: (data.teamB as number) ?? 0,
        setsA: (data.setsA as number) ?? 0,
        setsB: (data.setsB as number) ?? 0,
        currentSet: (data.currentSet as number) ?? 1,
        server: (data.server as CourtScore["server"]) ?? "home",
        pastSets: (data.pastSets as CourtScore["pastSets"]) ?? [],
    };
}
