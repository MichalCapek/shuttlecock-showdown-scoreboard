import { useState } from "react";
import { useParams } from "react-router-dom";
import {
    ArrowLeftRight,
    Pencil,
    Flag,
    Trash2,
} from "lucide-react";
import { useCourtScore } from "../hooks/useCourtScore";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useMatchInfo } from "../hooks/useMatchInfo";
import { useOverrideNames } from "@/hooks/useOverrideNames";
import { useCourtTracker } from "@/hooks/useCourtTracker";
import { TeamBox } from "@/components/TeamBox";
import { Button } from "@/components/ui/button";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { CourtControlShell } from "@/components/admin/CourtControlShell";
import { CourtTrackerPanel } from "@/components/admin/CourtTrackerPanel";
import { CourtTimerPanel } from "@/components/admin/CourtTimerPanel";
import { PastSetsMiniBar } from "@/components/admin/PastSetsMiniBar";
import { TeamNameOverrideDialog } from "@/components/admin/TeamNameOverrideDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { cn } from "@/lib/utils";
import type { PlayerSlot } from "@/types";

function ActionButton({
    onClick,
    icon: Icon,
    label,
    variant = "outline",
    className,
}: {
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    variant?: "outline" | "destructive" | "default";
    className?: string;
}) {
    return (
        <Button
            variant={variant === "default" ? "default" : variant}
            onClick={onClick}
            className={cn(
                "h-12 flex-col gap-0.5 px-1 py-1 text-[9px] font-medium leading-tight sm:text-[10px]",
                className
            )}
        >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
        </Button>
    );
}

export default function AdminCourt() {
    const { courtId } = useParams();
    const { matchInfo } = useMatchInfo();

    const { isAuthed, checkPassword } = useAdminAuth(courtId!);
    const { score, updateScore, setScore, resetMatch, toggleServer } = useCourtScore(courtId!);

    const { overrideNames, saveOverrideNames, clearOverrideNames } =
        useOverrideNames(courtId!);

    const {
        tracker,
        save: saveTracker,
        setGameMode,
        swapSides,
        swapPartnersOnSide,
        setServerForTeam,
        applyPointScored,
        syncServerPosition,
        reset: resetTracker,
        getDisplayName: getTrackerDisplayName,
        getSinglesNameForSide,
        isHomeOnLeft,
    } = useCourtTracker(courtId!);

    const [showNameDialog, setShowNameDialog] = useState(false);
    const [formNames, setFormNames] = useState({ teamAName: "", teamBName: "" });
    const [confirmAction, setConfirmAction] = useState<"endSet" | "reset" | null>(null);

    const courtLabel = courtId === "court1" ? "Kurt 1" : courtId === "court2" ? "Kurt 2" : courtId!;

    const getTeamName = (team: "A" | "B") =>
        team === "A"
            ? overrideNames.teamANameOverride || matchInfo.teamAName
            : overrideNames.teamBNameOverride || matchInfo.teamBName;

    const handleEndSet = async () => {
        const newPastSets = [...(score.pastSets || []), { teamA: score.teamA, teamB: score.teamB }];
        const setsA = score.teamA > score.teamB ? score.setsA + 1 : score.setsA;
        const setsB = score.teamB > score.teamA ? score.setsB + 1 : score.setsB;

        await setScore({
            teamA: 0,
            teamB: 0,
            setsA,
            setsB,
            currentSet: score.currentSet + 1,
            server: score.server,
            pastSets: newPastSets,
        });
        setConfirmAction(null);
    };

    const handleReset = async () => {
        await resetMatch();
        await resetTracker();
        setConfirmAction(null);
    };

    const handleToggleServer = async () => {
        const newTeam = score.server === "home" ? "B" : "A";
        await toggleServer();
        setServerForTeam(newTeam, score.teamA, score.teamB);
    };

    const handleSyncServerFromScore = async (team: "A" | "B") => {
        const currentTeam = score.server === "home" ? "A" : "B";
        if (currentTeam !== team) {
            await toggleServer();
        }
    };

    const handleSavePlayers = (players: Record<PlayerSlot, string>) => {
        saveTracker({
            leftTop: players.leftTop,
            leftBottom: players.leftBottom,
            rightTop: players.rightTop,
            rightBottom: players.rightBottom,
        });
    };

    const openNameDialog = () => {
        setFormNames({
            teamAName: overrideNames.teamANameOverride || "",
            teamBName: overrideNames.teamBNameOverride || "",
        });
        setShowNameDialog(true);
    };

    if (!isAuthed) {
        return (
            <AdminLogin
                title={`Přihlášení – ${courtLabel}`}
                description="Zadejte heslo pro ovládání tohoto kurtu"
                onLogin={checkPassword}
            />
        );
    }

    const servingTeam = score.server === "home" ? "A" : "B";

    const teamAProps = {
        displayName: getTeamName("A"),
        scoreValue: score.teamA,
        setsWon: score.setsA,
        isServer: score.server === "home",
        accent: "blue" as const,
        compact: true,
        onIncrement: async () => {
            const newScore = score.teamA + 1;
            await updateScore("A", newScore);
            applyPointScored("A", servingTeam, newScore, score.teamB);
        },
        onDecrement: () => updateScore("A", Math.max(0, score.teamA - 1)),
    };

    const teamBProps = {
        displayName: getTeamName("B"),
        scoreValue: score.teamB,
        setsWon: score.setsB,
        isServer: score.server === "away",
        accent: "red" as const,
        compact: true,
        onIncrement: async () => {
            const newScore = score.teamB + 1;
            await updateScore("B", newScore);
            applyPointScored("B", servingTeam, score.teamA, newScore);
        },
        onDecrement: () => updateScore("B", Math.max(0, score.teamB - 1)),
    };

    const actionBar = (
        <div className="flex items-stretch gap-1 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <ActionButton
                onClick={swapSides}
                icon={ArrowLeftRight}
                label="Prohodit"
                className="min-w-[3.25rem]"
            />
            <ActionButton
                onClick={openNameDialog}
                icon={Pencil}
                label="Jména"
                className="min-w-[3.25rem]"
            />
            <Button
                onClick={() => setConfirmAction("endSet")}
                className="h-12 min-w-0 flex-[2] gap-1.5 bg-brand-blue px-2 text-xs font-semibold hover:bg-brand-blue/90 sm:text-sm"
            >
                <Flag className="h-4 w-4 shrink-0" />
                Konec setu
            </Button>
            <Button
                variant="destructive"
                onClick={() => setConfirmAction("reset")}
                className="h-12 min-w-[3.5rem] flex-col gap-0.5 px-1 py-1 text-[9px] font-medium leading-tight sm:min-w-[4rem] sm:text-[10px]"
            >
                <Trash2 className="h-4 w-4 shrink-0" />
                Reset
            </Button>
        </div>
    );

    return (
        <>
            <CourtControlShell
                currentSet={score.currentSet}
                setsA={score.setsA}
                setsB={score.setsB}
                tracker={
                    <>
                        <CourtTrackerPanel
                            tracker={tracker}
                            scoreServer={score.server}
                            scoreA={score.teamA}
                            scoreB={score.teamB}
                            teamAName={getTeamName("A")}
                            teamBName={getTeamName("B")}
                            getDisplayName={getTrackerDisplayName}
                            getSinglesNameForSide={getSinglesNameForSide}
                            onSetGameMode={setGameMode}
                            onSwapPartnersOnSide={swapPartnersOnSide}
                            onSavePlayers={handleSavePlayers}
                            onSyncServerFromScore={handleSyncServerFromScore}
                            onSyncServerPosition={syncServerPosition}
                            onToggleServer={handleToggleServer}
                        />
                        <div className="mx-2 mt-5 shrink-0 border-t border-border/50 pt-3 sm:mx-3">
                            <div className="flex w-full justify-center gap-2">
                                {isHomeOnLeft ? (
                                    <>
                                        <TeamBox {...teamAProps} />
                                        <TeamBox {...teamBProps} />
                                    </>
                                ) : (
                                    <>
                                        <TeamBox {...teamBProps} />
                                        <TeamBox {...teamAProps} />
                                    </>
                                )}
                            </div>
                        </div>
                        <CourtTimerPanel />
                        <PastSetsMiniBar
                            teamAName={getTeamName("A")}
                            teamBName={getTeamName("B")}
                            pastSets={score.pastSets ?? []}
                            currentTeamA={score.teamA}
                            currentTeamB={score.teamB}
                        />
                    </>
                }
                actionBar={actionBar}
            />

            <TeamNameOverrideDialog
                open={showNameDialog}
                onOpenChange={setShowNameDialog}
                title="Přepsat jména týmů"
                description="Přepsaná jména se zobrazí pouze na tomto kurtu"
                teamAName={formNames.teamAName}
                teamBName={formNames.teamBName}
                onTeamAChange={(v) => setFormNames((p) => ({ ...p, teamAName: v }))}
                onTeamBChange={(v) => setFormNames((p) => ({ ...p, teamBName: v }))}
                onSave={async () => {
                    await saveOverrideNames(formNames.teamAName, formNames.teamBName);
                    setShowNameDialog(false);
                }}
                onClear={async () => {
                    await clearOverrideNames();
                    setFormNames({ teamAName: "", teamBName: "" });
                    setShowNameDialog(false);
                }}
            />

            <ConfirmDialog
                open={confirmAction === "endSet"}
                onOpenChange={(open) => !open && setConfirmAction(null)}
                title="Ukončit set?"
                description="Aktuální skóre bude uloženo do historie a body se vynulují. Vítěz setu získá +1 set."
                confirmLabel="Ukončit set"
                onConfirm={handleEndSet}
            />

            <ConfirmDialog
                open={confirmAction === "reset"}
                onOpenChange={(open) => !open && setConfirmAction(null)}
                title="Resetovat zápas?"
                description="Tato akce vynuluje skóre, sety i historii. Nelze ji vrátit zpět."
                confirmLabel="Resetovat"
                destructive
                onConfirm={handleReset}
            />
        </>
    );
}
