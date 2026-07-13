import { describe, expect, it } from "vitest";
import {
    getServiceSlotForScore,
    partnerSlot,
    sideForSlot,
    teamForSlot,
    teamOnLeft,
} from "./courtTrackerRules";

describe("sideForSlot", () => {
    it("maps slots to court sides", () => {
        expect(sideForSlot("leftTop")).toBe("left");
        expect(sideForSlot("rightBottom")).toBe("right");
    });
});

describe("teamForSlot", () => {
    it("resolves team from slot when A is on the left", () => {
        expect(teamForSlot("leftBottom", "left")).toBe("A");
        expect(teamForSlot("rightTop", "left")).toBe("B");
    });
});

describe("teamOnLeft", () => {
    it("returns true when team is on the left side", () => {
        expect(teamOnLeft("A", "left")).toBe(true);
        expect(teamOnLeft("B", "right")).toBe(true);
        expect(teamOnLeft("B", "left")).toBe(false);
    });
});

describe("partnerSlot", () => {
    it("swaps top and bottom on the same side", () => {
        expect(partnerSlot("leftTop")).toBe("leftBottom");
        expect(partnerSlot("rightBottom")).toBe("rightTop");
    });
});

describe("getServiceSlotForScore", () => {
    it("uses right service court on even scores", () => {
        expect(getServiceSlotForScore("A", "left", 0)).toBe("leftBottom");
        expect(getServiceSlotForScore("A", "left", 2)).toBe("leftBottom");
    });

    it("uses left service court on odd scores", () => {
        expect(getServiceSlotForScore("A", "left", 1)).toBe("leftTop");
        expect(getServiceSlotForScore("A", "left", 3)).toBe("leftTop");
    });
});
