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
        <div className="flex w-full flex-col items-center justify-between px-4 py-2 sm:flex-row sm:px-6 sm:py-4">
            <div className="flex w-full items-center justify-center gap-3 sm:hidden">
                <Trophy className="h-5 w-5 text-brand-red" />
                <h1 className="text-center text-base font-bold text-white drop-shadow-md">
                    {title} – {round}
                </h1>
            </div>

            <div className="hidden items-center gap-4 sm:flex">
                <Trophy className="h-6 w-6 text-brand-red sm:h-8 sm:w-8" />
                <h1 className="text-xl font-bold text-white drop-shadow-md sm:text-2xl">
                    {title} – {round}
                </h1>
            </div>

            <time
                dateTime={currentTime}
                className="hidden text-xl font-bold text-white drop-shadow-md sm:block sm:text-2xl"
            >
                {currentTime}
            </time>
        </div>
    );
};

export default OverallMatch;
