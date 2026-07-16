import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { HOME_TEAM_LOGO, loadAwayLogo } from "@/lib/teamLogos";

interface OverallScoreProps {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    awayLogoFileName: string;
}

const TeamLogo = ({ src, alt }: { src: string | null; alt: string }) => (
    <div className="scoreboard-tv-logo flex shrink-0 items-center justify-center rounded-xl border-2 border-white/25 bg-white p-1.5 shadow-lg shadow-black/30 sm:rounded-2xl sm:p-2">
        {src ? (
            <img src={src} alt={alt} className="h-full w-full object-contain" />
        ) : (
            <span className="text-[10px] font-semibold uppercase text-muted-foreground sm:text-xs">
                Logo
            </span>
        )}
    </div>
);

interface TeamSideProps {
    team: string;
    logoSrc: string | null;
    logoAlt: string;
    align: "left" | "right";
    singleLine?: boolean;
}

function TeamSide({ team, logoSrc, logoAlt, align, singleLine = false }: TeamSideProps) {
    return (
        <div
            className={cn(
                "scoreboard-team-side flex min-w-0 flex-1 items-start gap-1.5 xs:gap-2 sm:items-center sm:gap-3",
                align === "right" ? "flex-row-reverse text-right" : "flex-row text-left"
            )}
        >
            <TeamLogo src={logoSrc} alt={logoAlt} />
            <p
                className={cn(
                    "scoreboard-tv-team-name-overall min-w-0",
                    singleLine
                        ? "scoreboard-tv-team-name-overall--single-line"
                        : "break-words"
                )}
            >
                {team}
            </p>
        </div>
    );
}

const OverallScore = ({
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    awayLogoFileName,
}: OverallScoreProps) => {
    const [awayLogoUrl, setAwayLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        void loadAwayLogo(awayLogoFileName).then((url) => {
            if (!cancelled) setAwayLogoUrl(url);
        });

        return () => {
            cancelled = true;
        };
    }, [awayLogoFileName]);

    return (
        <div className="flex w-full min-w-0 items-center gap-1 xs:gap-2 sm:gap-4 md:gap-6">
            <TeamSide
                team={homeTeam}
                logoSrc={HOME_TEAM_LOGO}
                logoAlt={`${homeTeam} logo`}
                align="left"
                singleLine
            />

            <div className="flex min-w-0 shrink-0 items-center gap-0.5 xs:gap-1 sm:gap-2 md:gap-4">
                <span className="scoreboard-tv-set-score">{homeScore}</span>
                <span className="text-base font-bold text-white/40 xs:text-lg sm:text-2xl md:text-4xl">:</span>
                <span className="scoreboard-tv-set-score">{awayScore}</span>
            </div>

            <TeamSide
                team={awayTeam}
                logoSrc={awayLogoUrl}
                logoAlt={`${awayTeam} logo`}
                align="right"
            />
        </div>
    );
};

export default OverallScore;
