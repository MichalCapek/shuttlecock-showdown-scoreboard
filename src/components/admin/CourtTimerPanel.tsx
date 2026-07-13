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
        <div className="mx-2 mb-1.5 mt-5 shrink-0 border-t border-border/50 pt-3 sm:mx-3 lg:mx-0 lg:mt-0 lg:border-t-0 lg:pt-0">
            <div className="mb-1 flex items-center justify-between gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Časovač
                </span>
                <div className="flex items-center gap-0.5">
                    <Button
                        variant={isInterval ? "default" : "outline"}
                        size="sm"
                        onClick={() => switchMode("interval")}
                        className={cn(
                            "h-6 gap-0.5 px-1.5 text-[9px]",
                            isInterval && "bg-brand-blue hover:bg-brand-blue/90"
                        )}
                    >
                        <Timer className="h-2.5 w-2.5" />
                        Odpočet
                    </Button>
                    <Button
                        variant={!isInterval ? "default" : "outline"}
                        size="sm"
                        onClick={() => switchMode("injury")}
                        className={cn(
                            "h-6 gap-0.5 px-1.5 text-[9px]",
                            !isInterval && "bg-brand-blue hover:bg-brand-blue/90"
                        )}
                    >
                        <Clock className="h-2.5 w-2.5" />
                        Stopky
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-white px-2 py-1.5 shadow-sm">
                <div className="flex items-center gap-1.5">
                    <div
                        className={cn(
                            "min-w-[4.5rem] text-center font-mono text-2xl font-bold tabular-nums leading-none",
                            finished ? "text-amber-600" : "text-foreground"
                        )}
                    >
                        {formatTimerDisplay(seconds)}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        {isInterval && (
                            <div className="flex gap-0.5">
                                {presets.map((value) => (
                                    <Button
                                        key={value}
                                        variant={preset === value ? "default" : "outline"}
                                        size="sm"
                                        disabled={isRunning}
                                        onClick={() => applyPreset(value)}
                                        className={cn(
                                            "h-6 min-w-0 flex-1 px-1 text-[9px]",
                                            preset === value && "bg-brand-blue hover:bg-brand-blue/90"
                                        )}
                                    >
                                        {value}s
                                    </Button>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-0.5">
                            <Button
                                onClick={toggle}
                                disabled={isInterval && seconds === 0 && !isRunning}
                                className={cn(
                                    "h-6 flex-1 gap-1 text-[10px] font-semibold",
                                    isRunning
                                        ? "bg-amber-400 text-black hover:bg-amber-500"
                                        : "bg-brand-blue hover:bg-brand-blue/90"
                                )}
                            >
                                {isRunning ? (
                                    <>
                                        <Pause className="h-3 w-3" />
                                        Pauza
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-3 w-3" />
                                        Spustit
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={reset}
                                className="h-6 w-7 px-0"
                                aria-label="Resetovat časovač"
                            >
                                <RotateCcw className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
