import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Pencil, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CourtSide, CourtTrackerState, GameMode, PlayerSlot } from "@/types";
import { teamForSlot } from "@/hooks/useCourtTracker";
import {
    getSinglesPositions,
    SLOT_POSITIONS,
    teamOnLeft,
} from "@/lib/courtTrackerRules";
import shuttlecock from "../../../assets/shuttlecock.png";
import { CourtTrackerEditDialog } from "./CourtTrackerEditDialog";

interface CourtTrackerPanelProps {
    tracker: CourtTrackerState;
    scoreServer: "home" | "away";
    scoreA: number;
    scoreB: number;
    teamAName: string;
    teamBName: string;
    getDisplayName: (slot: PlayerSlot) => string;
    getSinglesNameForSide: (side: CourtSide) => string;
    onSetGameMode: (mode: GameMode) => void;
    onSwapPartnersOnSide: (side: CourtSide) => void;
    onSavePlayers: (players: Record<PlayerSlot, string>) => void;
    onSyncServerFromScore: (team: "A" | "B") => void;
    onSyncServerPosition: (serverTeam: "A" | "B", scoreA: number, scoreB: number) => void;
}

function PlayerChip({
    name,
    isServer,
    onClick,
}: {
    name: string;
    isServer: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex max-w-[4.5rem] items-center gap-1 rounded-md border bg-white/95 px-1.5 py-1 text-left shadow-sm transition-all active:scale-95 sm:max-w-[5.5rem]",
                isServer
                    ? "border-amber-400 ring-2 ring-amber-400/60"
                    : "border-white/80 hover:bg-white"
            )}
        >
            {isServer && (
                <img src={shuttlecock} alt="" className="h-3 w-3 shrink-0 object-contain" />
            )}
            <span className="truncate text-[10px] font-semibold leading-tight sm:text-[11px]">
                {name}
            </span>
        </button>
    );
}

function PartnerSwapButton({ onClick, className }: { onClick: () => void; className?: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "z-30 flex h-6 w-6 items-center justify-center rounded-full border border-white/80 bg-white/90 text-emerald-800 shadow-sm transition-transform active:scale-95",
                className
            )}
            aria-label="Prohodit partnery na této straně"
        >
            <ArrowUpDown className="h-3 w-3" />
        </button>
    );
}

export function CourtTrackerPanel({
    tracker,
    scoreServer,
    scoreA,
    scoreB,
    teamAName,
    teamBName,
    getDisplayName,
    getSinglesNameForSide,
    onSetGameMode,
    onSwapPartnersOnSide,
    onSavePlayers,
    onSyncServerFromScore,
    onSyncServerPosition,
}: CourtTrackerPanelProps) {
    const [showEdit, setShowEdit] = useState(false);
    const isSingles = tracker.gameMode === "singles";
    const serverTeam = scoreServer === "home" ? "A" : "B";

    useEffect(() => {
        onSyncServerPosition(serverTeam, scoreA, scoreB);
    }, [serverTeam, scoreA, scoreB, tracker.teamASide, tracker.gameMode, onSyncServerPosition]);

    const singlesLayout = useMemo(
        () => getSinglesPositions(serverTeam, tracker.teamASide, scoreA, scoreB),
        [serverTeam, tracker.teamASide, scoreA, scoreB]
    );

    const homeOnLeft = teamOnLeft("A", tracker.teamASide);
    const leftTeamName = homeOnLeft ? teamAName : teamBName;
    const rightTeamName = homeOnLeft ? teamBName : teamAName;

    const handleSlotClick = (slot: PlayerSlot) => {
        const team = teamForSlot(slot, tracker.teamASide);
        if (team !== serverTeam) {
            onSyncServerFromScore(team);
        }
        onSyncServerPosition(team, scoreA, scoreB);
    };

    const doublesSlots: PlayerSlot[] = ["leftTop", "leftBottom", "rightTop", "rightBottom"];

    return (
        <div className="mx-2 mt-1.5 shrink-0 sm:mx-3">
            <div className="mb-1.5 flex items-center justify-between gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Sledování kurtu
                </span>
                <div className="flex items-center gap-0.5">
                    <Button
                        variant={isSingles ? "default" : "outline"}
                        size="sm"
                        onClick={() => onSetGameMode("singles")}
                        className={cn(
                            "h-7 gap-1 px-2 text-[10px]",
                            isSingles && "bg-brand-blue hover:bg-brand-blue/90"
                        )}
                    >
                        <User className="h-3 w-3" />
                        Dvouhra
                    </Button>
                    <Button
                        variant={!isSingles ? "default" : "outline"}
                        size="sm"
                        onClick={() => onSetGameMode("doubles")}
                        className={cn(
                            "h-7 gap-1 px-2 text-[10px]",
                            !isSingles && "bg-brand-blue hover:bg-brand-blue/90"
                        )}
                    >
                        <Users className="h-3 w-3" />
                        Čtyřhra
                    </Button>
                </div>
            </div>

            <div className="relative mx-auto aspect-[2.4/1] w-full max-h-[7.5rem] overflow-hidden rounded-lg border-2 border-emerald-800/40 bg-emerald-600 shadow-inner sm:max-h-[9rem]">
                <div className="absolute inset-[4%] rounded border border-white/50" />
                <div className="absolute inset-y-[4%] left-1/2 w-px -translate-x-px bg-white/80" />
                <div className="absolute inset-x-[4%] top-1/2 h-px -translate-y-px bg-white/35" />
                <div className="absolute left-[4%] right-1/2 top-[30%] h-px bg-white/20" />
                <div className="absolute left-[4%] right-1/2 bottom-[30%] h-px bg-white/20" />
                <div className="absolute left-1/2 right-[4%] top-[30%] h-px bg-white/20" />
                <div className="absolute left-1/2 right-[4%] bottom-[30%] h-px bg-white/20" />

                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-800">
                    Síť
                </div>

                <span
                    className={cn(
                        "absolute left-1.5 top-1 max-w-[42%] truncate text-[8px] font-semibold",
                        homeOnLeft ? "text-brand-blue" : "text-brand-red"
                    )}
                >
                    {leftTeamName}
                </span>
                <span
                    className={cn(
                        "absolute right-1.5 top-1 max-w-[42%] truncate text-right text-[8px] font-semibold",
                        homeOnLeft ? "text-brand-red" : "text-brand-blue"
                    )}
                >
                    {rightTeamName}
                </span>

                {isSingles ? (
                    <>
                        {[singlesLayout.serverSlot, singlesLayout.receiverSlot].map((slot) => {
                            const isServer = slot === singlesLayout.serverSlot;
                            const side = slot.startsWith("left") ? "left" : "right";
                            const name = getSinglesNameForSide(side as CourtSide);

                            return (
                                <div key={slot} className={cn("absolute z-20", SLOT_POSITIONS[slot])}>
                                    <PlayerChip
                                        name={name}
                                        isServer={isServer}
                                        onClick={() => handleSlotClick(slot)}
                                    />
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <>
                        {doublesSlots.map((slot) => (
                            <div key={slot} className={cn("absolute z-20", SLOT_POSITIONS[slot])}>
                                <PlayerChip
                                    name={getDisplayName(slot)}
                                    isServer={tracker.serverSlot === slot}
                                    onClick={() => handleSlotClick(slot)}
                                />
                            </div>
                        ))}
                        <PartnerSwapButton
                            onClick={() => onSwapPartnersOnSide("left")}
                            className="absolute left-[12%] top-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                        <PartnerSwapButton
                            onClick={() => onSwapPartnersOnSide("right")}
                            className="absolute right-[12%] top-1/2 translate-x-1/2 -translate-y-1/2"
                        />
                    </>
                )}
            </div>

            <div className="mt-1.5 flex gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEdit(true)}
                    className="h-7 w-full gap-1 px-1 text-[10px]"
                >
                    <Pencil className="h-3 w-3" />
                    Jména hráčů
                </Button>
            </div>

            <CourtTrackerEditDialog
                open={showEdit}
                onOpenChange={setShowEdit}
                tracker={tracker}
                onSave={onSavePlayers}
            />
        </div>
    );
}
