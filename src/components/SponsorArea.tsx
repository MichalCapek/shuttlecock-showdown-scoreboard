import { useEffect, useState } from "react";
import benatkyLogo from "../../assets/benatky_logo.gif";
import CRProjectLogo from "../../assets/CR_Project_logo_new.png";
import victorLogo from "../../assets/victor-logo.png";
import { cn } from "@/lib/utils";

const SPONSORS = [
    { name: "Město Benátky", logo: benatkyLogo },
    { name: "Victor", logo: victorLogo },
    { name: "CR Project", logo: CRProjectLogo },
] as const;

const ROTATION_MS = 3000;

const SponsorArea = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % SPONSORS.length);
        }, ROTATION_MS);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex w-full items-center justify-center gap-4 py-1 sm:gap-6 md:gap-8">
            <span className="text-xs font-medium uppercase tracking-wider text-white/40 sm:text-sm">
                Partneři
            </span>
            <div className="flex items-center gap-5 sm:gap-6 md:gap-8">
                {SPONSORS.map((sponsor, index) => (
                    <img
                        key={sponsor.name}
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className={cn(
                            "scoreboard-tv-sponsor-logo transition-opacity duration-500",
                            index === activeIndex ? "opacity-100" : "opacity-35"
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

export default SponsorArea;
