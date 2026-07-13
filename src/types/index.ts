export interface CourtScore {
    teamA: number;
    teamB: number;
    setsA: number;
    setsB: number;
    currentSet: number;
    server: "home" | "away";
    pastSets: PastSet[];
}

export interface PastSet {
    teamA: number;
    teamB: number;
}

export interface MatchInfo {
    teamAName: string;
    teamBName: string;
    title: string;
    round: string;
    awayLogo?: string;
}

export interface OverrideNames {
    teamANameOverride: string;
    teamBNameOverride: string;
}

export interface TeamData {
    shortName: string;
    score: number;
    sets: number;
}

export interface CourtData {
    homeTeam: TeamData;
    awayTeam: TeamData;
    currentSet: number;
    server: "home" | "away";
    pastSets?: PastSet[];
}

export interface OverallMatchData {
    title: string;
    round: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
}
