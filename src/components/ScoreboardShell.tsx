import type { ReactNode } from "react";
import { BRAND_COLORS } from "@/constants";
import { cn } from "@/lib/utils";

interface ScoreboardShellProps {
    header: ReactNode;
    overallScore: ReactNode;
    courtLeft: ReactNode;
    courtRight: ReactNode;
    footer: ReactNode;
}

const sectionBorder = "border-white/60";

export const ScoreboardShell = ({
    header,
    overallScore,
    courtLeft,
    courtRight,
    footer,
}: ScoreboardShellProps) => {
    return (
        <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-brand-blue to-brand-red text-white">
            <header
                className={cn("flex h-auto items-center justify-center border-b-4 sm:h-16", sectionBorder)}
                style={{ backgroundColor: BRAND_COLORS.BLUE_OVERLAY }}
            >
                {header}
            </header>

            <section
                className="border-b-4 border-white/80 shadow-2xl"
                style={{ backgroundColor: BRAND_COLORS.RED_OVERLAY }}
            >
                {overallScore}
            </section>

            <main className="flex flex-1 flex-col md:flex-row">
                <div
                    className={cn(
                        "flex-1 border-b-4 px-2 sm:px-6 md:border-b-0 md:border-r-4",
                        sectionBorder
                    )}
                >
                    {courtLeft}
                </div>
                <div className="flex-1 px-2 sm:px-6">{courtRight}</div>
            </main>

            <footer
                className={cn("h-auto border-t-4 sm:h-16", sectionBorder)}
                style={{ backgroundColor: BRAND_COLORS.BLUE_OVERLAY }}
            >
                {footer}
            </footer>
        </div>
    );
};

export default ScoreboardShell;
