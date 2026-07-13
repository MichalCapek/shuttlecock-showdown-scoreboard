import homeTeamLogo from "../../assets/BkBenatky_logo.png";

const logos = import.meta.glob("../../assets/*.*", {
    eager: true,
    query: "?url",
    import: "default",
});

interface OverallScoreProps {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    awayLogoFileName: string;
}

const resolveAwayLogo = (fileName: string) => {
    const awayLogoPath = `../../assets/${fileName}`;
    return logos[awayLogoPath] ?? logos["../../assets/default.png"];
};

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
    const awayLogoUrl = resolveAwayLogo(awayLogoFileName);

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
