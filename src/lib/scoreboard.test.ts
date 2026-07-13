import { describe, expect, it } from "vitest";
import {
    buildCourtData,
    computeEndSetUpdate,
    getSetHistory,
    resolveTeamName,
} from "./scoreboard";
import { DEFAULT_COURT_SCORE } from "@/constants";

describe("resolveTeamName", () => {
    const matchInfo = { teamAName: "Benátky", teamBName: "Hosté" };

    it("returns global name when no override", () => {
        expect(resolveTeamName("A", matchInfo)).toBe("Benátky");
        expect(resolveTeamName("B", matchInfo)).toBe("Hosté");
    });

    it("returns trimmed override when set", () => {
        expect(
            resolveTeamName("A", matchInfo, { teamANameOverride: "  BK  ", teamBNameOverride: "" })
        ).toBe("BK");
    });
});

describe("getSetHistory", () => {
    it("appends current scores after past sets", () => {
        const history = getSetHistory({
            pastSets: [{ teamA: 21, teamB: 15 }],
            teamA: 10,
            teamB: 8,
        });
        expect(history).toEqual([
            { teamA: 21, teamB: 15 },
            { teamA: 10, teamB: 8 },
        ]);
    });
});

describe("computeEndSetUpdate", () => {
    it("awards set to team A when they lead", () => {
        const update = computeEndSetUpdate({
            ...DEFAULT_COURT_SCORE,
            teamA: 21,
            teamB: 18,
            setsA: 1,
            currentSet: 2,
            pastSets: [{ teamA: 21, teamB: 10 }],
        });

        expect(update).toEqual({
            teamA: 0,
            teamB: 0,
            setsA: 2,
            setsB: 0,
            currentSet: 3,
            pastSets: [
                { teamA: 21, teamB: 10 },
                { teamA: 21, teamB: 18 },
            ],
        });
    });

    it("does not increment sets on a tie", () => {
        const update = computeEndSetUpdate({
            ...DEFAULT_COURT_SCORE,
            teamA: 20,
            teamB: 20,
            setsA: 0,
            setsB: 0,
            currentSet: 1,
        });

        expect(update.setsA).toBe(0);
        expect(update.setsB).toBe(0);
        expect(update.currentSet).toBe(2);
    });
});

describe("buildCourtData", () => {
    it("maps firestore score to display model", () => {
        const data = buildCourtData(
            { ...DEFAULT_COURT_SCORE, teamA: 15, teamB: 12, setsA: 1, server: "away" },
            "Domácí",
            "Hosté",
            "home"
        );

        expect(data.homeTeam).toEqual({ shortName: "Domácí", score: 15, sets: 1 });
        expect(data.awayTeam).toEqual({ shortName: "Hosté", score: 12, sets: 0 });
        expect(data.server).toBe("away");
    });
});
