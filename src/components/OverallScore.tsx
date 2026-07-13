import { useEffect, useState } from "react";
import homeTeamLogo from "../../assets/BkBenatky_logo.png";

const awayLogoModules = import.meta.glob<string>("../../assets/*.{png,gif,jpg,jpeg,webp}", {
    query: "?url",
    import: "default",
});

async function loadAwayLogo(fileName: string): Promise<string> {
    const path = `../../assets/${fileName}`;
    const loader = awayLogoModules[path];
    if (loader) return loader();

    const fallback = awayLogoModules["../../assets/BkBenatky_logo.png"];
    return fallback ? fallback() : homeTeamLogo;
}

interface OverallScoreProps {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    awayLogoFileName: string;
}

const TeamLogo = ({ src, alt }: { src: string; alt: string }) => (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white p-2 shadow-lg sm:h-40 sm:w-40 sm:p-3">
        <img src={src} alt={alt} className="h-full w-full object-contain" />
    </div>
);

const OverallScore = ({
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    awayLogoFileName,
}: OverallScoreProps) => {
    const [awayLogoUrl, setAwayLogoUrl] = useState(homeTeamLogo);

    useEffect(() => {
        let cancelled = false;
        loadAwayLogo(awayLogoFileName).then((url) => {
            if (!cancelled) setAwayLogoUrl(url);
        });
        return () => {
            cancelled = true;
        };
    }, [awayLogoFileName]);

    return (
        <div className="w-full px-6 py-4 sm:px-4 sm:py-6">
            <div className="flex flex-col gap-6 sm:hidden">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <TeamLogo src={homeTeamLogo} alt={`${homeTeam} logo`} />
                        <span className="text-base font-bold text-white">{homeTeam}</span>
                    </div>
                    <span className="text-4xl font-black text-white drop-shadow-lg">
                        {homeScore}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <TeamLogo src={awayLogoUrl} alt={`${awayTeam} logo`} />
                        <span className="text-base font-bold text-white">{awayTeam}</span>
                    </div>
                    <span className="text-4xl font-black text-white drop-shadow-lg">
                        {awayScore}
                    </span>
                </div>
            </div>

            <div className="hidden items-center justify-center gap-12 sm:flex">
                <div className="flex items-center gap-6">
                    <TeamLogo src={homeTeamLogo} alt={`${homeTeam} logo`} />
                    <span className="text-2xl font-semibold text-white">{homeTeam}</span>
                    <span className="text-9xl font-black text-white drop-shadow-lg">
                        {homeScore}
                    </span>
                </div>

                <span className="text-2xl font-bold text-white/80">VS</span>

                <div className="flex items-center gap-6">
                    <span className="text-9xl font-black text-white drop-shadow-lg">
                        {awayScore}
                    </span>
                    <span className="text-2xl font-semibold text-white">{awayTeam}</span>
                    <TeamLogo src={awayLogoUrl} alt={`${awayTeam} logo`} />
                </div>
            </div>
        </div>
    );
};

export default OverallScore;
