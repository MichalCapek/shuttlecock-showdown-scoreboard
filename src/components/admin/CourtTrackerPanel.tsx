import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpDown, Pencil, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CourtSide, CourtTrackerState, GameMode, PlayerSlot } from "@/types";
import { teamForSlot } from "@/lib/courtTrackerRules";
import {
    getSinglesPositions,
    SLOT_POSITIONS,
    teamOnLeft,
} from "@/lib/courtTrackerRules";
import shuttlecock from "../../../assets/shuttlecock.png";
import { CourtTrackerEditDialog } from "./CourtTrackerEditDialog";
import { BadmintonCourtLines } from "./BadmintonCourtLines";

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
    onToggleServer: () => void;
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
                "pointer-events-auto inline-flex w-max items-start gap-0.5 rounded-md border bg-white/95 px-1 py-0.5 text-left text-emerald-900 shadow-sm transition-all active:scale-95",
                isServer
                    ? "border-amber-400 ring-2 ring-amber-400/60"
                    : "border-white/80 hover:bg-white"
            )}
        >
            {isServer && (
                <img src={shuttlecock} alt="" className="mt-px h-2.5 w-2.5 shrink-0 object-contain" />
            )}
            <span className="whitespace-normal break-words text-[9px] font-semibold leading-tight sm:text-[10px]">
                {name}
            </span>
        </button>
    );
}

function PartnerSwapButton({ onClick, className }: { onClick: () => void; className?: string }) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={cn(
                "pointer-events-auto relative z-50 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/95 text-emerald-800 shadow-sm transition-transform active:scale-95",
                className
            )}
            aria-label="Prohodit partnery na této straně"
        >
            <ArrowUpDown className="h-2.5 w-2.5" />
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
    onToggleServer,
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
        <div className="mx-2 mt-1.5 shrink-0 sm:mx-3 lg:mx-0">
            <div className="mb-1.5 flex items-center justify-between gap-1">
                <span className="admin-section-label">Sledování kurtu</span>
                <div className="flex items-center gap-0.5">
                    <Button
                        variant={isSingles ? "default" : "outline"}
                        size="sm"
                        onClick={() => onSetGameMode("singles")}
                        className={cn(
                            "court-control-btn gap-1 px-2 text-[10px]",
                            isSingles
                                ? "bg-brand-blue hover:bg-brand-blue/90"
                                : "admin-outline-btn"
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
                            "court-control-btn gap-1 px-2 text-[10px]",
                            !isSingles
                                ? "bg-brand-blue hover:bg-brand-blue/90"
                                : "admin-outline-btn"
                        )}
                    >
                        <Users className="h-3 w-3" />
                        Čtyřhra
                    </Button>
                </div>
            </div>

            <div className="relative mx-auto aspect-[134/61] w-full max-h-[6rem] overflow-hidden rounded-lg border-2 border-emerald-900/50 bg-gradient-to-b from-emerald-500 to-emerald-700 shadow-inner xs:max-h-[6.5rem] sm:max-h-[7.5rem] md:max-h-[8.5rem] lg:max-h-[10rem] xl:max-h-none">
                <BadmintonCourtLines isSingles={isSingles} />

                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-800 shadow-sm">
                    Síť
                </div>

                <span
                    className={cn(
                        "absolute left-1.5 top-1 max-w-[45%] break-words leading-tight text-[8px] font-semibold",
                        homeOnLeft ? "text-brand-blue" : "text-brand-red"
                    )}
                >
                    {leftTeamName}
                </span>
                <span
                    className={cn(
                        "absolute right-1.5 top-1 max-w-[45%] break-words text-right leading-tight text-[8px] font-semibold",
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
                        <PartnerSwapButton
                            onClick={() => onSwapPartnersOnSide("left")}
                            className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                        <PartnerSwapButton
                            onClick={() => onSwapPartnersOnSide("right")}
                            className="absolute left-3/4 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                        {doublesSlots.map((slot) => (
                            <div
                                key={slot}
                                className={cn("pointer-events-none absolute z-20", SLOT_POSITIONS[slot])}
                            >
                                <PlayerChip
                                    name={getDisplayName(slot)}
                                    isServer={tracker.serverSlot === slot}
                                    onClick={() => handleSlotClick(slot)}
                                />
                            </div>
                        ))}
                    </>
                )}
            </div>

            <div className="mt-1.5 flex gap-1">
                <Button
                    size="sm"
                    onClick={onToggleServer}
                    className="court-control-btn flex-1 gap-1 border-amber-400 bg-amber-400 px-1 text-[10px] text-black hover:bg-amber-500"
                >
                    <span className="inline-flex items-center gap-0.5">
                        <ArrowLeft className="h-3 w-3" />
                        <ArrowRight className="h-3 w-3" />
                    </span>
                    Servis
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEdit(true)}
                    className="admin-outline-btn court-control-btn flex-1 gap-1 px-1 text-[10px]"
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
