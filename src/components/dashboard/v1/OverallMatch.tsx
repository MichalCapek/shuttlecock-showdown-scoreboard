import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

interface OverallMatchProps {
    title: string;
    round: string;
}

const OverallMatch = ({ title, round }: OverallMatchProps) => {
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleString("cs-CZ", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );
        };

        updateTime();
        const interval = setInterval(updateTime, 60_000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex w-full flex-col items-center gap-1 px-3 py-2 xs:px-4 sm:flex-row sm:justify-between sm:gap-4 sm:px-6 sm:py-3">
            <div className="flex w-full items-center justify-center gap-2 sm:w-auto sm:justify-start sm:gap-3 md:gap-4">
                <Trophy className="h-5 w-5 shrink-0 text-brand-red xs:h-6 xs:w-6 md:h-8 md:w-8" />
                <h1 className="text-center text-sm font-bold leading-tight text-white drop-shadow-md xs:text-base sm:text-left sm:text-xl md:text-2xl">
                    {title} – {round}
                </h1>
            </div>

            <time
                dateTime={currentTime}
                className="text-xs font-semibold tabular-nums text-white/90 drop-shadow-md xs:text-sm sm:text-lg md:text-xl md:font-bold md:text-white"
            >
                {currentTime}
            </time>
        </div>
    );
};

export default OverallMatch;
