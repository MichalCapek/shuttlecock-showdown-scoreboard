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
        <div className="mx-2 mb-1.5 mt-4 shrink-0 border-t border-border/50 pt-3 xs:mx-3 sm:mt-5 lg:mx-0 lg:mt-0 lg:border-t-0 lg:pt-0">
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
                            "min-h-[44px] gap-0.5 px-1.5 text-[9px] xs:text-[10px]",
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
                            "min-h-[44px] gap-0.5 px-1.5 text-[9px] xs:text-[10px]",
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
                            "min-w-[4rem] text-center font-mono text-xl font-bold tabular-nums leading-none xs:min-w-[4.5rem] xs:text-2xl",
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
                                            "min-h-[44px] min-w-0 flex-1 px-1 text-[9px] xs:text-[10px]",
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
                                    "min-h-[44px] flex-1 gap-1 text-[10px] font-semibold",
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
                                className="min-h-[44px] min-w-[2.75rem] px-0"
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
