import homeTeamLogo from "../../assets/BkBenatky_logo.png";

const awayLogoModules = import.meta.glob<string>("../../assets/*.{png,gif,jpg,jpeg,webp}", {
    query: "?url",
    import: "default",
});

export const HOME_TEAM_LOGO = homeTeamLogo;

/** Strip path prefixes so "assets/KLI_logo.png" or "/KLI_logo.png" still resolve. */
export function normalizeLogoFileName(fileName: string): string {
    return fileName.trim().replace(/^\.?\/?(assets\/)?/i, "");
}

const awayLogoLoaders = new Map<string, () => Promise<string>>();

for (const [modulePath, loader] of Object.entries(awayLogoModules)) {
    const baseName = modulePath.split("/").pop();
    if (!baseName) continue;
    awayLogoLoaders.set(baseName.toLowerCase(), loader);
}

export function getAvailableAwayLogos(): string[] {
    return [...awayLogoLoaders.keys()].sort();
}

export async function loadAwayLogo(fileName: string): Promise<string | null> {
    const normalized = normalizeLogoFileName(fileName);
    if (!normalized) return null;

    let loader = awayLogoLoaders.get(normalized.toLowerCase());

    if (!loader && !/\.\w+$/.test(normalized)) {
        loader = awayLogoLoaders.get(`${normalized.toLowerCase()}.png`);
    }

    if (!loader) {
        if (import.meta.env.DEV) {
            console.warn(
                `[teamLogos] Logo file not found: "${fileName}". ` +
                    `Available in assets/: ${getAvailableAwayLogos().join(", ")}`
            );
        }
        return null;
    }

    return loader();
}
