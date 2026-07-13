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

export interface MatchInfoWithOverallScore extends MatchInfo {
    overallScoreA: number;
    overallScoreB: number;
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

export type GameMode = "singles" | "doubles";
export type CourtSide = "left" | "right";
export type PlayerSlot = "leftTop" | "leftBottom" | "rightTop" | "rightBottom";

export interface CourtTrackerState {
    gameMode: GameMode;
    leftTop: string;
    leftBottom: string;
    rightTop: string;
    rightBottom: string;
    teamASide: CourtSide;
    serverSlot: PlayerSlot;
}
