import type { CourtSide, GameMode, PlayerSlot } from "@/types";

/**
 * Horizontal court view (umpire sideline). Each half has top/bottom service courts.
 * Left-side player faces the net (right): right service = bottom, left service = top.
 * Right-side player faces the net (left): right service = top, left service = bottom.
 * Even score → right service court; odd → left service court.
 */

export function teamOnLeft(team: "A" | "B", teamASide: CourtSide): boolean {
    return (
        (team === "A" && teamASide === "left") ||
        (team === "B" && teamASide === "right")
    );
}

export function sideForSlot(slot: PlayerSlot): CourtSide {
    return slot.startsWith("left") ? "left" : "right";
}

export function teamForSide(side: CourtSide, teamASide: CourtSide): "A" | "B" {
    return side === teamASide ? "A" : "B";
}

export function teamForSlot(slot: PlayerSlot, teamASide: CourtSide): "A" | "B" {
    return teamForSide(sideForSlot(slot), teamASide);
}

export function partnerSlot(slot: PlayerSlot): PlayerSlot {
    const map: Record<PlayerSlot, PlayerSlot> = {
        leftTop: "leftBottom",
        leftBottom: "leftTop",
        rightTop: "rightBottom",
        rightBottom: "rightTop",
    };
    return map[slot];
}

export function getRightServiceSlot(team: "A" | "B", teamASide: CourtSide): PlayerSlot {
    return teamOnLeft(team, teamASide) ? "leftBottom" : "rightTop";
}

export function getLeftServiceSlot(team: "A" | "B", teamASide: CourtSide): PlayerSlot {
    return teamOnLeft(team, teamASide) ? "leftTop" : "rightBottom";
}

/** Service court for a team based on their score parity. */
export function getServiceSlotForScore(
    team: "A" | "B",
    teamASide: CourtSide,
    teamScore: number
): PlayerSlot {
    return teamScore % 2 === 0
        ? getRightServiceSlot(team, teamASide)
        : getLeftServiceSlot(team, teamASide);
}

export function getSinglesPositions(
    serverTeam: "A" | "B",
    teamASide: CourtSide,
    scoreA: number,
    scoreB: number
): { serverSlot: PlayerSlot; receiverSlot: PlayerSlot } {
    const serverScore = serverTeam === "A" ? scoreA : scoreB;
    const serverOnLeft =
        (serverTeam === "A" && teamASide === "left") ||
        (serverTeam === "B" && teamASide === "right");
    const servesRightCourt = serverScore % 2 === 0;

    if (serverOnLeft) {
        const serverSlot: PlayerSlot = servesRightCourt ? "leftBottom" : "leftTop";
        const receiverSlot: PlayerSlot = servesRightCourt ? "rightTop" : "rightBottom";
        return { serverSlot, receiverSlot };
    }

    const serverSlot: PlayerSlot = servesRightCourt ? "rightTop" : "rightBottom";
    const receiverSlot: PlayerSlot = servesRightCourt ? "leftBottom" : "leftTop";
    return { serverSlot, receiverSlot };
}

export function slotsForTeamSide(team: "A" | "B", teamASide: CourtSide): PlayerSlot[] {
    const onLeft = teamOnLeft(team, teamASide);
    return onLeft ? ["leftTop", "leftBottom"] : ["rightTop", "rightBottom"];
}

export function firstSlotForTeam(
    team: "A" | "B",
    teamASide: CourtSide,
    gameMode: GameMode,
    scoreA = 0,
    scoreB = 0
): PlayerSlot {
    if (gameMode === "singles") {
        return getSinglesPositions(team, teamASide, scoreA, scoreB).serverSlot;
    }
    const teamScore = team === "A" ? scoreA : scoreB;
    return getServiceSlotForScore(team, teamASide, teamScore);
}

type PlayerNames = Pick<
    import("@/types").CourtTrackerState,
    "leftTop" | "leftBottom" | "rightTop" | "rightBottom"
>;

/** Swap partner names on one side of the court. */
export function swapPartnerNamesOnSide(
    names: PlayerNames,
    side: CourtSide
): PlayerNames {
    if (side === "left") {
        return {
            ...names,
            leftTop: names.leftBottom,
            leftBottom: names.leftTop,
        };
    }
    return {
        ...names,
        rightTop: names.rightBottom,
        rightBottom: names.rightTop,
    };
}

export function courtSideForTeam(team: "A" | "B", teamASide: CourtSide): CourtSide {
    return teamOnLeft(team, teamASide) ? "left" : "right";
}

/**
 * BWF doubles service rotation after a point is scored.
 * - Serving side wins: partners swap courts on their side.
 * - Server court is always derived from the new score parity (even = right, odd = left).
 */
export function advanceDoublesServe(
    teamASide: CourtSide,
    names: PlayerNames,
    scoringTeam: "A" | "B",
    servingTeamBefore: "A" | "B",
    scoreA: number,
    scoreB: number
): { serverSlot: PlayerSlot } & PlayerNames {
    const scoringScore = scoringTeam === "A" ? scoreA : scoreB;
    let updatedNames = names;

    if (scoringTeam === servingTeamBefore) {
        const servingSide = courtSideForTeam(servingTeamBefore, teamASide);
        updatedNames = swapPartnerNamesOnSide(names, servingSide);
    }

    return {
        ...updatedNames,
        serverSlot: getServiceSlotForScore(scoringTeam, teamASide, scoringScore),
    };
}

export const SLOT_POSITIONS: Record<PlayerSlot, string> = {
    leftTop: "left-[10%] top-[20%]",
    leftBottom: "left-[10%] bottom-[20%]",
    rightTop: "right-[10%] top-[20%]",
    rightBottom: "right-[10%] bottom-[20%]",
};

export const SLOT_PLACEHOLDERS: Record<PlayerSlot, string> = {
    leftTop: "Vlevo – nahoře",
    leftBottom: "Vlevo – dole",
    rightTop: "Vpravo – nahoře",
    rightBottom: "Vpravo – dole",
};

export function migrateLegacySlot(slot: string): PlayerSlot {
    const map: Record<string, PlayerSlot> = {
        topLeft: "leftTop",
        topRight: "leftBottom",
        bottomLeft: "rightTop",
        bottomRight: "rightBottom",
        leftFar: "leftTop",
        leftNear: "leftBottom",
        rightNear: "rightTop",
        rightFar: "rightBottom",
        leftTop: "leftTop",
        leftBottom: "leftBottom",
        rightTop: "rightTop",
        rightBottom: "rightBottom",
    };
    return map[slot] ?? "leftBottom";
}

export function migrateLegacySide(side: string): CourtSide {
    if (side === "top") return "left";
    if (side === "bottom") return "right";
    return side === "right" ? "right" : "left";
}

export function migrateLegacyNames(parsed: Record<string, unknown>): PlayerNames {
    if ("leftTop" in parsed) {
        return {
            leftTop: (parsed.leftTop as string) ?? "",
            leftBottom: (parsed.leftBottom as string) ?? "",
            rightTop: (parsed.rightTop as string) ?? "",
            rightBottom: (parsed.rightBottom as string) ?? "",
        };
    }
    if ("leftFar" in parsed) {
        return {
            leftTop: (parsed.leftFar as string) ?? "",
            leftBottom: (parsed.leftNear as string) ?? "",
            rightTop: (parsed.rightNear as string) ?? "",
            rightBottom: (parsed.rightFar as string) ?? "",
        };
    }
    return {
        leftTop: (parsed.topLeft as string) ?? "",
        leftBottom: (parsed.topRight as string) ?? "",
        rightTop: (parsed.bottomLeft as string) ?? "",
        rightBottom: (parsed.bottomRight as string) ?? "",
    };
}
