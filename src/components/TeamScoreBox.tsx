import { Badge } from "@/components/ui/badge";
import ShuttlecockIcon from "../../assets/shuttlecock.png";
import type { TeamData } from "@/types";
import { BRAND_COLORS } from "@/constants";

interface TeamScoreBoxProps {
    team: TeamData;
    isServer: boolean;
    isMobile?: boolean;
}

export const TeamScoreBox = ({ team, isServer, isMobile = false }: TeamScoreBoxProps) => {
    const bgColor = isServer ? BRAND_COLORS.WHITE_TRANSPARENT : BRAND_COLORS.BLUE_TRANSPARENT;

    if (isMobile) {
        return (
            <div
                className={`p-2 rounded-xl w-full text-left border-2 ${
                    isServer ? "border-white shadow-lg shadow-white/20" : "border-white/30"
                }`}
                style={{ backgroundColor: bgColor }}
            >
                <div className="flex flex-row justify-between items-center min-h-[5.5rem] px-2">
                    <div className="text-white text-base font-bold">{team.shortName}</div>
                    <div className="text-4xl font-bold text-white">{team.score}</div>
                </div>
                <div className="flex justify-center min-h-[1.5rem] mt-1">
                    {isServer && (
                        <img
                            src={ShuttlecockIcon}
                            alt="servis"
                            className="w-5 h-5 opacity-80"
                        />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`p-6 rounded-2xl border-4 transition-all duration-300 w-full max-w-xs ${
                isServer ? "border-white shadow-lg shadow-white/20" : "border-white/30"
            }`}
            style={{ backgroundColor: bgColor }}
        >
            <div className="flex flex-col items-center">
                <div className="text-center min-h-[10rem] flex flex-col justify-center">
                    <h3 className="text-4xl font-bold text-white mb-6">{team.shortName}</h3>
                    <div className="text-8xl font-bold text-white mb-6">{team.score}</div>
                </div>
                <div className="min-h-[3rem] flex items-center justify-center">
                    {isServer && (
                        <Badge className="text-white text-lg px-4 py-2 bg-brand-red">
                            SERVIS
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamScoreBox;
