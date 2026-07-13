import { useEffect, useState, useCallback } from "react";
import type { CourtTrackerState, CourtSide, GameMode, PlayerSlot } from "@/types";
import { DEFAULT_COURT_TRACKER } from "@/constants";
import {
    advanceDoublesServe,
    firstSlotForTeam,
    getServiceSlotForScore,
    getSinglesPositions,
    migrateLegacyNames,
    migrateLegacySide,
    migrateLegacySlot,
    SLOT_PLACEHOLDERS,
    swapPartnerNamesOnSide,
    teamOnLeft,
} from "@/lib/courtTrackerRules";

const ALL_SLOTS: PlayerSlot[] = ["leftTop", "leftBottom", "rightTop", "rightBottom"];

const STORAGE_KEY = (courtId: string) => `court-tracker-${courtId}`;

function parseStoredState(raw: string): CourtTrackerState {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const names = migrateLegacyNames(parsed);

    return {
        gameMode: (parsed.gameMode as GameMode) ?? DEFAULT_COURT_TRACKER.gameMode,
        ...names,
        teamASide: migrateLegacySide((parsed.teamASide as string) ?? "left"),
        serverSlot: migrateLegacySlot((parsed.serverSlot as string) ?? "leftBottom"),
    };
}

function loadTracker(courtId: string): CourtTrackerState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY(courtId));
        if (raw) return parseStoredState(raw);
    } catch {
        // ignore corrupt local data
    }
    return DEFAULT_COURT_TRACKER;
}

function persistTracker(courtId: string, state: CourtTrackerState) {
    localStorage.setItem(STORAGE_KEY(courtId), JSON.stringify(state));
}

export function sideForSlot(slot: PlayerSlot): CourtSide {
    return slot.startsWith("left") ? "left" : "right";
}

export function teamForSide(side: CourtSide, teamASide: CourtSide): "A" | "B" {
    return side === teamASide ? "A" : "B";
}

export function teamForSlot(slot: PlayerSlot, teamASide: CourtSide): "A" | "B" {
    return teamForSide(sideForSlot(slot), teamASide);
}

export { SLOT_PLACEHOLDERS };

export function useCourtTracker(courtId: string) {
    const [tracker, setTracker] = useState<CourtTrackerState>(() => loadTracker(courtId));

    useEffect(() => {
        setTracker(loadTracker(courtId));
    }, [courtId]);

    const save = useCallback(
        (updates: Partial<CourtTrackerState>) => {
            setTracker((prev) => {
                const next = { ...prev, ...updates };
                persistTracker(courtId, next);
                return next;
            });
        },
        [courtId]
    );

    const setGameMode = (gameMode: GameMode) => {
        save({ gameMode });
    };

    const setPlayerName = (slot: PlayerSlot, name: string) => save({ [slot]: name });

    const setServerSlot = (serverSlot: PlayerSlot) => save({ serverSlot });

    const swapSides = useCallback(() => {
        setTracker((prev) => {
            const newTeamASide: CourtSide = prev.teamASide === "left" ? "right" : "left";
            const slotMap: Record<PlayerSlot, PlayerSlot> = {
                leftTop: "rightTop",
                leftBottom: "rightBottom",
                rightTop: "leftTop",
                rightBottom: "leftBottom",
            };
            const next = {
                ...prev,
                leftTop: prev.rightTop,
                leftBottom: prev.rightBottom,
                rightTop: prev.leftTop,
                rightBottom: prev.leftBottom,
                teamASide: newTeamASide,
                serverSlot: slotMap[prev.serverSlot],
            };
            persistTracker(courtId, next);
            return next;
        });
    }, [courtId]);

    const swapPartnersOnSide = useCallback((side: CourtSide) => {
        setTracker((prev) => {
            const swapped = swapPartnerNamesOnSide(
                {
                    leftTop: prev.leftTop,
                    leftBottom: prev.leftBottom,
                    rightTop: prev.rightTop,
                    rightBottom: prev.rightBottom,
                },
                side
            );
            const next = { ...prev, ...swapped };
            persistTracker(courtId, next);
            return next;
        });
    }, [courtId]);

    const setServerForTeam = (team: "A" | "B", scoreA: number, scoreB: number) => {
        const slot = firstSlotForTeam(team, tracker.teamASide, tracker.gameMode, scoreA, scoreB);
        save({ serverSlot: slot });
    };

    const applyPointScored = useCallback(
        (
            scoringTeam: "A" | "B",
            servingTeamBefore: "A" | "B",
            scoreA: number,
            scoreB: number
        ) => {
            setTracker((prev) => {
                let next: CourtTrackerState;

                if (prev.gameMode === "singles") {
                    const { serverSlot } = getSinglesPositions(
                        scoringTeam,
                        prev.teamASide,
                        scoreA,
                        scoreB
                    );
                    next = { ...prev, serverSlot };
                } else {
                    const updates = advanceDoublesServe(
                        prev.teamASide,
                        {
                            leftTop: prev.leftTop,
                            leftBottom: prev.leftBottom,
                            rightTop: prev.rightTop,
                            rightBottom: prev.rightBottom,
                        },
                        scoringTeam,
                        servingTeamBefore,
                        scoreA,
                        scoreB
                    );
                    next = { ...prev, ...updates };
                }

                persistTracker(courtId, next);
                return next;
            });
        },
        [courtId]
    );

    const syncServerPosition = useCallback(
        (serverTeam: "A" | "B", scoreA: number, scoreB: number) => {
            setTracker((prev) => {
                const serverSlot =
                    prev.gameMode === "singles"
                        ? getSinglesPositions(serverTeam, prev.teamASide, scoreA, scoreB).serverSlot
                        : getServiceSlotForScore(
                              serverTeam,
                              prev.teamASide,
                              serverTeam === "A" ? scoreA : scoreB
                          );

                if (serverSlot === prev.serverSlot) return prev;
                const next = { ...prev, serverSlot };
                persistTracker(courtId, next);
                return next;
            });
        },
        [courtId]
    );

    const reset = () => {
        localStorage.removeItem(STORAGE_KEY(courtId));
        setTracker(DEFAULT_COURT_TRACKER);
    };

    const getDisplayName = (slot: PlayerSlot): string => {
        return tracker[slot].trim() || SLOT_PLACEHOLDERS[slot];
    };

    const getSinglesNameForSide = (side: CourtSide): string => {
        const slot = side === "left" ? "leftTop" : "rightTop";
        return getDisplayName(slot);
    };

    const isHomeOnLeft = tracker.teamASide === "left";

    return {
        tracker,
        save,
        setGameMode,
        setPlayerName,
        setServerSlot,
        swapSides,
        swapPartnersOnSide,
        setServerForTeam,
        applyPointScored,
        syncServerPosition,
        reset,
        getDisplayName,
        getSinglesNameForSide,
        isHomeOnLeft,
        teamOnLeft: (team: "A" | "B") => teamOnLeft(team, tracker.teamASide),
        allSlots: ALL_SLOTS,
    };
}
