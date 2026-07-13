import { describe, expect, it } from "vitest";
import { COURT_IDS } from "@/constants";
import { getCourtLabel, getCourtNumber, isCourtId } from "./courts";

describe("isCourtId", () => {
    it("accepts valid court ids", () => {
        expect(isCourtId(COURT_IDS.COURT_1)).toBe(true);
        expect(isCourtId(COURT_IDS.COURT_2)).toBe(true);
    });

    it("rejects invalid values", () => {
        expect(isCourtId(undefined)).toBe(false);
        expect(isCourtId("court3")).toBe(false);
        expect(isCourtId("")).toBe(false);
    });
});

describe("getCourtLabel", () => {
    it("returns Czech labels", () => {
        expect(getCourtLabel(COURT_IDS.COURT_1)).toBe("Kurt 1");
        expect(getCourtLabel(COURT_IDS.COURT_2)).toBe("Kurt 2");
    });
});

describe("getCourtNumber", () => {
    it("maps court id to display number", () => {
        expect(getCourtNumber(COURT_IDS.COURT_1)).toBe(1);
        expect(getCourtNumber(COURT_IDS.COURT_2)).toBe(2);
    });
});
