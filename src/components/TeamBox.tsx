import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TeamBoxProps {
    displayName: string;
    scoreValue: number;
    setsWon?: number;
    isServer: boolean;
    accent?: "blue" | "red";
    compact?: boolean;
    darkSurface?: boolean;
    onIncrement: () => void;
    onDecrement: () => void;
}

export const TeamBox = ({
    displayName,
    scoreValue,
    setsWon,
    isServer,
    accent = "blue",
    compact = false,
    darkSurface = false,
    onIncrement,
    onDecrement,
}: TeamBoxProps) => {
    const accentStyles =
        accent === "blue"
            ? "border-brand-blue/30 bg-gradient-to-b from-brand-blue/5 to-white"
            : "border-brand-red/30 bg-gradient-to-b from-brand-red/5 to-white";

    const incrementStyles =
        accent === "blue"
            ? "bg-brand-blue hover:bg-brand-blue/90"
            : "bg-brand-red hover:bg-brand-red/90";

    if (compact) {
        const darkAccent =
            accent === "blue"
                ? "admin-team-box admin-team-box--blue"
                : "admin-team-box admin-team-box--red";
        const lightAccent =
            accent === "blue"
                ? "border-brand-blue/30 bg-gradient-to-b from-brand-blue/5 to-white"
                : "border-brand-red/30 bg-gradient-to-b from-brand-red/5 to-white";

        return (
            <div
                className={cn(
                    "flex min-w-0 flex-1 flex-col rounded-xl border-2 p-1 xs:max-w-[11.5rem] sm:max-w-[12.5rem] lg:min-w-[12rem] lg:max-w-[14rem]",
                    darkSurface ? darkAccent : lightAccent,
                    isServer && "ring-2 ring-amber-400/70 ring-offset-1 ring-offset-[#001428]"
                )}
            >
                <div className="shrink-0">
                    <p className="min-h-[2.4em] break-words text-[11px] font-semibold leading-tight xs:text-xs">
                        {displayName}
                    </p>
                    <div className="flex flex-wrap items-center gap-1">
                        {setsWon !== undefined && (
                            <span className={cn("text-[10px]", darkSurface ? "admin-team-meta" : "text-muted-foreground")}>
                                {setsWon} {setsWon === 1 ? "set" : "sety"}
                            </span>
                        )}
                        {isServer && (
                            <span className={cn("text-[10px] font-semibold", darkSurface ? "admin-team-serve" : "text-amber-600")}>
                                • Podává
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-center py-0.5">
                    <span className="text-[clamp(2rem,10vw,3rem)] font-bold tabular-nums leading-none sm:text-5xl">
                        {scoreValue}
                    </span>
                </div>

                <div className="grid shrink-0 grid-cols-2 gap-1">
                    <Button
                        onClick={onDecrement}
                        variant="outline"
                        className={cn("court-control-btn", darkSurface && "admin-outline-btn border-white/25")}
                        aria-label="Snížit skóre"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={onIncrement}
                        className={cn("court-control-btn", incrementStyles)}
                        aria-label="Zvýšit skóre"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "flex w-full max-w-xs flex-col items-center rounded-2xl border-2 p-4 shadow-sm xs:p-6",
                accentStyles,
                isServer && "ring-2 ring-amber-400/60 ring-offset-2"
            )}
        >
            <div className="mb-1 flex w-full flex-col gap-1">
                <h2 className="break-words text-center text-base font-semibold leading-snug xs:text-lg">
                    {displayName}
                </h2>
                {setsWon !== undefined && (
                    <span className="text-center text-xs font-medium text-muted-foreground">
                        {setsWon} {setsWon === 1 ? "set" : "sety"}
                    </span>
                )}
            </div>

            {isServer && (
                <span className="mb-2 text-center text-xs font-semibold text-amber-600">Podává</span>
            )}

            <p className="my-3 text-[clamp(3rem,14vw,4.5rem)] font-bold tabular-nums tracking-tight xs:my-4">
                {scoreValue}
            </p>

            <div className="flex w-full gap-2 xs:gap-3">
                <Button
                    onClick={onDecrement}
                    variant="outline"
                    size="lg"
                    className="min-h-[44px] flex-1 text-xl"
                    aria-label="Snížit skóre"
                >
                    <Minus className="h-6 w-6" />
                </Button>
                <Button
                    onClick={onIncrement}
                    size="lg"
                    className={cn("min-h-[44px] flex-1 text-xl", incrementStyles)}
                    aria-label="Zvýšit skóre"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
};

export default TeamBox;
