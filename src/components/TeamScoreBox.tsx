import { Badge } from "@/components/ui/badge";
import ShuttlecockIcon from "../../assets/shuttlecock.png";
import type { TeamData } from "@/types";
import { BRAND_COLORS } from "@/constants";
import { cn } from "@/lib/utils";

interface TeamScoreBoxProps {
    team: TeamData;
    isServer: boolean;
}

export const TeamScoreBox = ({ team, isServer }: TeamScoreBoxProps) => {
    const bgColor = isServer ? BRAND_COLORS.WHITE_TRANSPARENT : BRAND_COLORS.BLUE_TRANSPARENT;

    return (
        <div
            className={cn(
                "min-w-0 flex-1 rounded-xl border-2 p-1 transition-all duration-300 xs:p-1.5 sm:rounded-2xl sm:border-4 sm:p-2 md:p-2.5 lg:p-3",
                isServer ? "border-white shadow-lg shadow-white/20" : "border-white/30"
            )}
            style={{ backgroundColor: bgColor }}
        >
            <div className="flex flex-col items-center">
                <div className="flex w-full min-h-0 flex-col justify-center text-center">
                    <h3 className="mb-1 min-h-[2.4em] break-words text-sm font-bold leading-tight text-white xs:text-base sm:mb-1.5 sm:text-lg md:mb-2 md:text-xl lg:text-2xl xl:text-3xl">
                        {team.shortName}
                    </h3>
                    <div className="text-[clamp(1.75rem,9vw,6rem)] font-bold tabular-nums leading-none text-white sm:text-[clamp(2rem,10vw,5rem)] lg:text-[clamp(2.5rem,7vw,8rem)]">
                        {team.score}
                    </div>
                </div>
                <div className="mt-0.5 flex min-h-[1rem] items-center justify-center sm:mt-1 sm:min-h-[1.5rem] md:min-h-[2rem]">
                    {isServer && (
                        <>
                            <img
                                src={ShuttlecockIcon}
                                alt="servis"
                                className="h-4 w-4 opacity-80 sm:hidden"
                            />
                            <Badge className="hidden bg-brand-red px-1.5 py-0.5 text-xs text-white sm:inline-flex sm:px-2 sm:py-0.5 sm:text-sm md:px-3 md:py-1">
                                SERVIS
                            </Badge>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamScoreBox;
