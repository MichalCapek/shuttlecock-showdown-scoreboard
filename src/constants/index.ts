import type { CourtScore, CourtTrackerState } from "@/types";

export const COURT_IDS = {
    COURT_1: "court1",
    COURT_2: "court2",
} as const;

export const FIRESTORE_COLLECTIONS = {
    COURTS: "courts",
    MATCH: "match",
    ADMIN: "admin",
} as const;

export const FIRESTORE_DOCS = {
    GLOBAL: "global",
    OVERRIDE_NAMES: "overrideNames",
    NAMES: "names",
} as const;

export const DEFAULT_COURT_TRACKER: CourtTrackerState = {
    gameMode: "doubles",
    leftTop: "",
    leftBottom: "",
    rightTop: "",
    rightBottom: "",
    teamASide: "left",
    serverSlot: "leftBottom",
};

export const DEFAULT_COURT_SCORE: CourtScore = {
    teamA: 0,
    teamB: 0,
    setsA: 0,
    setsB: 0,
    currentSet: 1,
    server: "home",
    pastSets: [],
};

export const BRAND_COLORS = {
    BLUE: "#004A90",
    RED: "#E3161B",
    BLUE_OVERLAY: "rgba(0, 74, 144, 0.95)",
    RED_OVERLAY: "rgba(227, 22, 27, 0.95)",
    BLUE_TRANSPARENT: "rgba(0, 74, 144, 0.3)",
    WHITE_TRANSPARENT: "rgba(255, 255, 255, 0.2)",
} as const;
