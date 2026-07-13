import { useCallback, useEffect, useRef, useState } from "react";

export type TimerMode = "interval" | "injury";

const INTERVAL_PRESETS = [60, 90, 120] as const;

export function formatTimerDisplay(totalSeconds: number): string {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function useCourtTimer() {
    const [mode, setMode] = useState<TimerMode>("interval");
    const [preset, setPreset] = useState(60);
    const [seconds, setSeconds] = useState(60);
    const [isRunning, setIsRunning] = useState(false);
    const [finished, setFinished] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const reset = useCallback(() => {
        clearTimer();
        setIsRunning(false);
        setFinished(false);
        setSeconds(mode === "interval" ? preset : 0);
    }, [clearTimer, mode, preset]);

    const pause = useCallback(() => {
        clearTimer();
        setIsRunning(false);
    }, [clearTimer]);

    const start = useCallback(() => {
        if (mode === "interval" && seconds === 0) return;
        setFinished(false);
        setIsRunning(true);
    }, [mode, seconds]);

    const toggle = useCallback(() => {
        if (isRunning) pause();
        else start();
    }, [isRunning, pause, start]);

    const switchMode = useCallback(
        (newMode: TimerMode) => {
            clearTimer();
            setMode(newMode);
            setIsRunning(false);
            setFinished(false);
            setSeconds(newMode === "interval" ? preset : 0);
        },
        [clearTimer, preset]
    );

    const applyPreset = useCallback(
        (value: number) => {
            clearTimer();
            setPreset(value);
            setSeconds(value);
            setIsRunning(false);
            setFinished(false);
        },
        [clearTimer]
    );

    useEffect(() => {
        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
            setSeconds((current) => {
                if (mode === "interval") {
                    if (current <= 1) {
                        clearTimer();
                        setIsRunning(false);
                        setFinished(true);
                        return 0;
                    }
                    return current - 1;
                }
                return current + 1;
            });
        }, 1000);

        return clearTimer;
    }, [isRunning, mode, clearTimer]);

    useEffect(() => () => clearTimer(), [clearTimer]);

    return {
        mode,
        seconds,
        preset,
        isRunning,
        finished,
        presets: INTERVAL_PRESETS,
        switchMode,
        applyPreset,
        toggle,
        reset,
    };
}
