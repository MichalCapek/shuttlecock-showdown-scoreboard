import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScoreboardShellProps {
    header: ReactNode;
    overallScore: ReactNode;
    courtLeft: ReactNode;
    courtRight: ReactNode;
    footer: ReactNode;
}

export const ScoreboardShell = ({
    header,
    overallScore,
    courtLeft,
    courtRight,
    footer,
}: ScoreboardShellProps) => {
    return (
        <div className="scoreboard-arena flex h-dvh w-full flex-col overflow-hidden text-white">
            <div className="h-0.5 shrink-0 bg-gradient-to-r from-brand-blue via-white/40 to-brand-red" />

            <header
                className={cn(
                    "relative shrink-0 border-b border-white/10",
                    "px-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))]",
                    "py-1 sm:py-1.5"
                )}
            >
                {header}
            </header>

            <section className="relative shrink-0 border-b border-white/10 px-2 py-1.5 sm:px-4 sm:py-2">
                {overallScore}
            </section>

            <main className="flex min-h-0 flex-1 flex-col gap-2 px-2 py-2 sm:flex-row sm:gap-3 sm:px-3 sm:py-3">
                <div
                    className={cn(
                        "flex min-h-0 min-w-0 flex-1 flex-col",
                        "rounded-xl border border-white/10 bg-white/[0.04] sm:rounded-2xl"
                    )}
                >
                    {courtLeft}
                </div>
                <div
                    className={cn(
                        "flex min-h-0 min-w-0 flex-1 flex-col",
                        "rounded-xl border border-white/10 bg-white/[0.04] sm:rounded-2xl"
                    )}
                >
                    {courtRight}
                </div>
            </main>

            <footer
                className={cn(
                    "shrink-0 border-t border-white/10 bg-black/30",
                    "px-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))]",
                    "pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 sm:pt-2"
                )}
            >
                {footer}
            </footer>
        </div>
    );
};

export default ScoreboardShell;
