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
        return (
            <div
                className={cn(
                    "flex w-[46%] max-w-[10.5rem] flex-col rounded-xl border-2 p-2 sm:max-w-[11.5rem] lg:w-auto lg:min-w-[12rem] lg:max-w-[14rem] lg:flex-1",
                    accentStyles,
                    isServer && "ring-2 ring-amber-400/70 ring-offset-1"
                )}
            >
                <div className="shrink-0">
                    <p className="truncate text-[11px] font-semibold leading-tight">{displayName}</p>
                    <div className="flex items-center gap-1">
                        {setsWon !== undefined && (
                            <span className="text-[10px] text-muted-foreground">
                                {setsWon} {setsWon === 1 ? "set" : "sety"}
                            </span>
                        )}
                        {isServer && (
                            <span className="text-[10px] font-semibold text-amber-600">• Podává</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-center py-2">
                    <span className="text-4xl font-bold tabular-nums leading-none sm:text-5xl">
                        {scoreValue}
                    </span>
                </div>

                <div className="grid shrink-0 grid-cols-2 gap-1.5">
                    <Button
                        onClick={onDecrement}
                        variant="outline"
                        className="h-10"
                        aria-label="Snížit skóre"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={onIncrement}
                        className={cn("h-10", incrementStyles)}
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
                "flex w-full max-w-xs flex-col items-center rounded-2xl border-2 p-6 shadow-sm",
                accentStyles,
                isServer && "ring-2 ring-amber-400/60 ring-offset-2"
            )}
        >
            <div className="mb-1 flex w-full items-center justify-between gap-2">
                <h2 className="truncate text-lg font-semibold">{displayName}</h2>
                {setsWon !== undefined && (
                    <span className="shrink-0 text-xs font-medium text-muted-foreground">
                        {setsWon} {setsWon === 1 ? "set" : "sety"}
                    </span>
                )}
            </div>

            {isServer && (
                <span className="mb-2 text-xs font-semibold text-amber-600">Podává</span>
            )}

            <p className="my-4 text-7xl font-bold tabular-nums tracking-tight">{scoreValue}</p>

            <div className="flex w-full gap-3">
                <Button
                    onClick={onDecrement}
                    variant="outline"
                    size="lg"
                    className="h-14 flex-1 text-xl"
                    aria-label="Snížit skóre"
                >
                    <Minus className="h-6 w-6" />
                </Button>
                <Button
                    onClick={onIncrement}
                    size="lg"
                    className={cn("h-14 flex-1 text-xl", incrementStyles)}
                    aria-label="Zvýšit skóre"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
};

export default TeamBox;
