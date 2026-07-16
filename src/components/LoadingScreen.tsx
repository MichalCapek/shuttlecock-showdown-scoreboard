import { cn } from "@/lib/utils";

interface LoadingScreenProps {
    message?: string;
    variant?: "default" | "scoreboard";
}

export const LoadingScreen = ({
    message = "Načítám data...",
    variant = "default",
}: LoadingScreenProps) => {
    const isScoreboard = variant === "scoreboard";

    return (
        <div
            className={cn(
                "flex min-h-dvh items-center justify-center px-4",
                isScoreboard ? "scoreboard-arena text-white" : "bg-background text-foreground"
            )}
        >
            <div className="flex flex-col items-center gap-4 xs:gap-5">
                {isScoreboard && (
                    <div className="h-1 w-24 rounded-full bg-gradient-to-r from-brand-blue via-white/40 to-brand-red" />
                )}
                <div className="relative flex h-12 w-12 items-center justify-center xs:h-14 xs:w-14">
                    <div
                        className={cn(
                            "absolute inset-0 animate-spin rounded-full border-2 border-transparent",
                            isScoreboard
                                ? "border-t-brand-blue border-r-brand-red"
                                : "border-t-primary"
                        )}
                    />
                    <div
                        className={cn(
                            "h-6 w-6 rounded-full",
                            isScoreboard ? "bg-white/10" : "bg-muted"
                        )}
                    />
                </div>
                <span className="text-center text-base font-medium xs:text-lg sm:text-xl">
                    {message}
                </span>
            </div>
        </div>
    );
};

export default LoadingScreen;
