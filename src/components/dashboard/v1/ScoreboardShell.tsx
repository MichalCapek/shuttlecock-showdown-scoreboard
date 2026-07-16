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
        <div className="flex min-h-dvh w-full flex-col bg-gradient-to-br from-brand-blue to-brand-red text-white">
            <header
                className={cn(
                    "flex shrink-0 items-center justify-center border-b-4 px-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] py-2 sm:min-h-16 sm:py-0",
                    sectionBorder
                )}
                style={{ backgroundColor: BRAND_COLORS.BLUE_OVERLAY }}
            >
                {header}
            </header>

            <section
                className="shrink-0 border-b-4 border-white/80 shadow-2xl"
                style={{ backgroundColor: BRAND_COLORS.RED_OVERLAY }}
            >
                {overallScore}
            </section>

            <main className="flex min-h-0 flex-1 flex-col sm:flex-row">
                <div
                    className={cn(
                        "flex min-h-0 min-w-0 flex-1 flex-col border-b-4 px-2 py-2 xs:px-3 sm:border-b-0 sm:border-r-4 sm:px-4 md:px-6",
                        sectionBorder
                    )}
                >
                    {courtLeft}
                </div>
                <div className="flex min-h-0 min-w-0 flex-1 flex-col px-2 py-2 xs:px-3 sm:px-4 md:px-6">
                    {courtRight}
                </div>
            </main>

            <footer
                className={cn(
                    "shrink-0 border-t-4 px-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:min-h-16",
                    sectionBorder
                )}
                style={{ backgroundColor: BRAND_COLORS.BLUE_OVERLAY }}
            >
                {footer}
            </footer>
        </div>
    );
};

export default ScoreboardShell;
