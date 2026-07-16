import { describe, expect, it } from "vitest";
import { getAvailableAwayLogos, loadAwayLogo, normalizeLogoFileName } from "./teamLogos";

describe("normalizeLogoFileName", () => {
    it("strips assets/ prefix and whitespace", () => {
        expect(normalizeLogoFileName("  assets/KLI_logo.png  ")).toBe("KLI_logo.png");
        expect(normalizeLogoFileName("/BRN_SLA_logo.png")).toBe("BRN_SLA_logo.png");
    });
});

describe("loadAwayLogo", () => {
    it("loads a known asset by file name", async () => {
        const url = await loadAwayLogo("KLI_logo.png");
        expect(url).toBeTruthy();
        expect(typeof url).toBe("string");
    });

    it("loads when extension is omitted", async () => {
        const url = await loadAwayLogo("KLI_logo");
        expect(url).toBeTruthy();
    });

    it("returns null for missing files", async () => {
        expect(await loadAwayLogo("does-not-exist.png")).toBeNull();
        expect(await loadAwayLogo("")).toBeNull();
    });

    it("lists bundled away logos", () => {
        const logos = getAvailableAwayLogos();
        expect(logos).toContain("kli_logo.png");
        expect(logos).toContain("bkbenatky_logo.png");
    });
});
