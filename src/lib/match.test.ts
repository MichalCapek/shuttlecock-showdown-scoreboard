import { describe, expect, it } from "vitest";
import { parseCourtDoc, parseMatchDoc } from "./match";

describe("parseMatchDoc", () => {
    it("applies defaults for missing fields", () => {
        expect(parseMatchDoc({})).toEqual({
            teamAName: "Tým A",
            teamBName: "Tým B",
            title: "Zápas",
            round: "",
            overallScoreA: 0,
            overallScoreB: 0,
            awayLogo: "default.png",
        });
    });

    it("preserves provided values", () => {
        expect(
            parseMatchDoc({
                teamAName: "A",
                teamBName: "B",
                title: "Finále",
                round: "1",
                overallScoreA: 2,
                overallScoreB: 1,
                awayLogo: "guest.png",
            })
        ).toEqual({
            teamAName: "A",
            teamBName: "B",
            title: "Finále",
            round: "1",
            overallScoreA: 2,
            overallScoreB: 1,
            awayLogo: "guest.png",
        });
    });
});

describe("parseCourtDoc", () => {
    it("applies defaults for missing fields", () => {
        expect(parseCourtDoc({})).toEqual({
            teamA: 0,
            teamB: 0,
            setsA: 0,
            setsB: 0,
            currentSet: 1,
            server: "home",
            pastSets: [],
        });
    });

    it("parses past sets array", () => {
        expect(
            parseCourtDoc({
                teamA: 5,
                teamB: 3,
                pastSets: [{ teamA: 21, teamB: 19 }],
            }).pastSets
        ).toEqual([{ teamA: 21, teamB: 19 }]);
    });
});
