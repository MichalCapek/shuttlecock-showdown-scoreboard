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

const teamNameClass = cn(
    "line-clamp-2 min-h-[2.6em] min-w-0 flex-1 break-words px-2 text-center",
    "font-bold leading-[1.3] text-white",
    "text-sm xs:text-base md:text-lg lg:text-xl xl:text-2xl"
);

const scoreClass = cn(
    "shrink-0 font-black tabular-nums text-white drop-shadow-lg",
    "text-3xl xs:text-4xl md:text-[clamp(2.5rem,6vw,5rem)] lg:text-[clamp(3rem,7vw,6rem)]"
);

const vsClass = cn(
    "shrink-0 px-2 text-center font-bold text-white/80",
    "text-sm xs:text-base md:px-4 md:text-lg lg:text-xl xl:text-2xl"
);

const TeamLogo = ({ src, alt }: { src: string | null; alt: string }) => (
    <div
        className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-white shadow-lg",
            "h-14 w-14 p-1.5 xs:h-16 xs:w-16 xs:p-2 md:h-20 md:w-20 lg:h-24 lg:w-24"
        )}
    >
        {src ? (
            <img src={src} alt={alt} className="h-full w-full object-contain" />
        ) : (
            <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground xs:text-[10px]">
                Logo
            </span>
        )}
    </div>
);

interface TeamSideProps {
    team: string;
    score: number;
    logoSrc: string | null;
    logoAlt: string;
    reverse?: boolean;
}

function TeamSide({ team, score, logoSrc, logoAlt, reverse = false }: TeamSideProps) {
    const name = <span className={teamNameClass}>{team}</span>;
    const logo = <TeamLogo src={logoSrc} alt={logoAlt} />;
    const scoreEl = <span className={scoreClass}>{score}</span>;

    return (
        <div
            className="flex min-w-0 flex-1 basis-0 items-center gap-2 xs:gap-3 md:gap-4"
        >
            {reverse ? (
                <>
                    {scoreEl}
                    {name}
                    {logo}
                </>
            ) : (
                <>
                    {logo}
                    {name}
                    {scoreEl}
                </>
            )}
        </div>
    );
}

function MobileTeamRow({
    team,
    score,
    logoSrc,
    logoAlt,
}: {
    team: string;
    score: number;
    logoSrc: string | null;
    logoAlt: string;
}) {
    return (
        <div className="flex w-full min-w-0 items-center gap-2 xs:gap-3">
            <TeamLogo src={logoSrc} alt={logoAlt} />
            <span className={teamNameClass}>{team}</span>
            <span className={scoreClass}>{score}</span>
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
        <div className="w-full px-4 py-3 xs:px-6 sm:py-4 md:py-5 lg:px-8 lg:py-6">
            <div className="flex flex-col gap-3 md:hidden">
                <MobileTeamRow
                    team={homeTeam}
                    score={homeScore}
                    logoSrc={HOME_TEAM_LOGO}
                    logoAlt={`${homeTeam} logo`}
                />
                <MobileTeamRow
                    team={awayTeam}
                    score={awayScore}
                    logoSrc={awayLogoUrl}
                    logoAlt={`${awayTeam} logo`}
                />
            </div>

            <div className="hidden w-full items-center md:flex">
                <TeamSide
                    team={homeTeam}
                    score={homeScore}
                    logoSrc={HOME_TEAM_LOGO}
                    logoAlt={`${homeTeam} logo`}
                />

                <span className={vsClass}>VS</span>

                <TeamSide
                    team={awayTeam}
                    score={awayScore}
                    logoSrc={awayLogoUrl}
                    logoAlt={`${awayTeam} logo`}
                    reverse
                />
            </div>
        </div>
    );
};

export default OverallScore;
