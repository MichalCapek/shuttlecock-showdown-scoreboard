import { useEffect, useState } from "react";
import benatkyLogo from "../../assets/benatky_logo.gif";
import CRProjectLogo from "../../assets/CR_Project_logo_new.png";
import victorLogo from "../../assets/victor-logo.png";

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
        <div className="flex h-full w-full flex-col flex-wrap items-center justify-center gap-2 px-3 py-3 xs:gap-3 sm:flex-row sm:gap-4 md:gap-6">
            <span className="shrink-0 text-center text-xs font-medium text-white/90 xs:text-sm sm:text-base">
                Partneři klubu:
            </span>
            <div className="flex max-w-full flex-wrap items-center justify-center gap-3 xs:gap-4 sm:gap-5 md:gap-6">
                {SPONSORS.map((sponsor, index) => (
                    <div
                        key={sponsor.name}
                        className={`shrink-0 transition-all duration-500 ${
                            index === activeIndex
                                ? "scale-105 opacity-100"
                                : "scale-100 opacity-30"
                        }`}
                    >
                        <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className="h-7 w-auto max-w-[5rem] object-contain xs:h-8 sm:h-10 md:h-12"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SponsorArea;
