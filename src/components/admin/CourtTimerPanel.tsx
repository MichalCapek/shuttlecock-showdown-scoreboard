import { Clock, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTimerDisplay, useCourtTimer } from "@/hooks/useCourtTimer";

export function CourtTimerPanel() {
    const {
        mode,
        seconds,
        preset,
        isRunning,
        finished,
        presets,
        switchMode,
        applyPreset,
        toggle,
        reset,
    } = useCourtTimer();

    const isInterval = mode === "interval";

    return (
        <div className="mx-2 mb-1.5 mt-5 shrink-0 border-t border-border/50 pt-3 sm:mx-3">
            <div className="mb-1.5 flex items-center justify-between gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Časovač
                </span>
                <div className="flex items-center gap-0.5">
                    <Button
                        variant={isInterval ? "default" : "outline"}
                        size="sm"
                        onClick={() => switchMode("interval")}
                        className={cn(
                            "h-7 gap-1 px-2 text-[10px]",
                            isInterval && "bg-brand-blue hover:bg-brand-blue/90"
                        )}
                    >
                        <Timer className="h-3 w-3" />
                        Odpočet
                    </Button>
                    <Button
                        variant={!isInterval ? "default" : "outline"}
                        size="sm"
                        onClick={() => switchMode("injury")}
                        className={cn(
                            "h-7 gap-1 px-2 text-[10px]",
                            !isInterval && "bg-brand-blue hover:bg-brand-blue/90"
                        )}
                    >
                        <Clock className="h-3 w-3" />
                        Stopky
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-white px-3 py-2 shadow-sm">
                <div
                    className={cn(
                        "py-1 text-center font-mono text-3xl font-bold tabular-nums tracking-tight sm:text-4xl",
                        finished ? "text-amber-600" : "text-foreground"
                    )}
                >
                    {formatTimerDisplay(seconds)}
                </div>

                {isInterval && (
                    <div className="mt-1.5 flex justify-center gap-1">
                        {presets.map((value) => (
                            <Button
                                key={value}
                                variant={preset === value ? "default" : "outline"}
                                size="sm"
                                disabled={isRunning}
                                onClick={() => applyPreset(value)}
                                className={cn(
                                    "h-7 min-w-[2.75rem] px-2 text-[10px]",
                                    preset === value && "bg-brand-blue hover:bg-brand-blue/90"
                                )}
                            >
                                {value}s
                            </Button>
                        ))}
                    </div>
                )}

                <div className="mt-1.5 flex gap-1">
                    <Button
                        onClick={toggle}
                        disabled={isInterval && seconds === 0 && !isRunning}
                        className={cn(
                            "h-8 flex-1 gap-1.5 text-[11px] font-semibold",
                            isRunning
                                ? "bg-amber-400 text-black hover:bg-amber-500"
                                : "bg-brand-blue hover:bg-brand-blue/90"
                        )}
                    >
                        {isRunning ? (
                            <>
                                <Pause className="h-3.5 w-3.5" />
                                Pauza
                            </>
                        ) : (
                            <>
                                <Play className="h-3.5 w-3.5" />
                                Spustit
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={reset}
                        className="h-8 min-w-[2.75rem] px-2"
                        aria-label="Resetovat časovač"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
