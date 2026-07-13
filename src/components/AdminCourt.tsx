import { useState } from "react";
import { useParams } from "react-router-dom";
import {
    ArrowLeftRight,
    Pencil,
    Flag,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useCourtScore } from "@/hooks/useCourtScore";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useMatchInfo } from "@/hooks/useMatchInfo";
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
import { LoadingScreen } from "@/components/LoadingScreen";
import NotFound from "@/pages/NotFound";
import { cn } from "@/lib/utils";
import { isCourtId, getCourtLabel, type CourtId } from "@/lib/courts";
import { resolveTeamName } from "@/lib/scoreboard";
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

function AdminCourtContent({ courtId }: { courtId: CourtId }) {
    const { matchInfo, loading: matchLoading } = useMatchInfo();
    const { isAuthed, checkPassword } = useAdminAuth(courtId);
    const { score, updateScore, endSet, resetMatch, toggleServer } = useCourtScore(courtId);
    const { overrideNames, saveOverrideNames, clearOverrideNames } = useOverrideNames(courtId);

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
    } = useCourtTracker(courtId);

    const [showNameDialog, setShowNameDialog] = useState(false);
    const [formNames, setFormNames] = useState({ teamAName: "", teamBName: "" });
    const [confirmAction, setConfirmAction] = useState<"endSet" | "reset" | null>(null);

    const courtLabel = getCourtLabel(courtId);

    const getTeamName = (team: "A" | "B") =>
        matchInfo ? resolveTeamName(team, matchInfo, overrideNames) : "";

    const handleEndSet = async () => {
        const ok = await endSet();
        if (!ok) toast.error("Nepodařilo se ukončit set");
        setConfirmAction(null);
    };

    const handleReset = async () => {
        const ok = await resetMatch();
        if (!ok) {
            toast.error("Nepodařilo se resetovat zápas");
            return;
        }
        await resetTracker();
        setConfirmAction(null);
    };

    const handleToggleServer = async () => {
        const newTeam = score.server === "home" ? "B" : "A";
        const ok = await toggleServer();
        if (!ok) {
            toast.error("Nepodařilo se přepnout servis");
            return;
        }
        setServerForTeam(newTeam, score.teamA, score.teamB);
    };

    const handleSyncServerFromScore = async (team: "A" | "B") => {
        const currentTeam = score.server === "home" ? "A" : "B";
        if (currentTeam !== team) {
            const ok = await toggleServer();
            if (!ok) toast.error("Nepodařilo se přepnout servis");
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

    if (matchLoading || !matchInfo) {
        return <LoadingScreen />;
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
            const ok = await updateScore("A", newScore);
            if (!ok) {
                toast.error("Nepodařilo se aktualizovat skóre");
                return;
            }
            applyPointScored("A", servingTeam, newScore, score.teamB);
        },
        onDecrement: async () => {
            const ok = await updateScore("A", Math.max(0, score.teamA - 1));
            if (!ok) toast.error("Nepodařilo se aktualizovat skóre");
        },
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
            const ok = await updateScore("B", newScore);
            if (!ok) {
                toast.error("Nepodařilo se aktualizovat skóre");
                return;
            }
            applyPointScored("B", servingTeam, score.teamA, newScore);
        },
        onDecrement: async () => {
            const ok = await updateScore("B", Math.max(0, score.teamB - 1));
            if (!ok) toast.error("Nepodařilo se aktualizovat skóre");
        },
    };

    const actionBar = (
        <div className="flex items-stretch gap-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:gap-2">
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
                    <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start lg:gap-x-6 lg:px-6 xl:grid-cols-[minmax(0,3fr)_minmax(18rem,1fr)] xl:gap-x-8 xl:px-8">
                        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
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
                        </div>
                        <div className="mx-2 mt-5 shrink-0 border-t border-border/50 pt-3 sm:mx-3 lg:col-start-1 lg:row-start-2 lg:mx-0">
                            <div className="flex w-full justify-center gap-2 lg:mx-auto lg:max-w-2xl lg:gap-4">
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
                        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
                            <CourtTimerPanel />
                        </div>
                        <div className="min-w-0 lg:col-start-2 lg:row-start-2">
                            <PastSetsMiniBar
                                teamAName={getTeamName("A")}
                                teamBName={getTeamName("B")}
                                score={score}
                            />
                        </div>
                    </div>
                }
                actionBar={actionBar}
            />

            <TeamNameOverrideDialog
                open={showNameDialog}
                onOpenChange={setShowNameDialog}
                title="Přepsat jména týmů"
                description="Přepsaná jména se zobrazí na tomto kurtu na scoreboardu, streamu i court view"
                teamAName={formNames.teamAName}
                teamBName={formNames.teamBName}
                onTeamAChange={(v) => setFormNames((p) => ({ ...p, teamAName: v }))}
                onTeamBChange={(v) => setFormNames((p) => ({ ...p, teamBName: v }))}
                onSave={async () => {
                    const ok = await saveOverrideNames(formNames.teamAName, formNames.teamBName);
                    if (!ok) {
                        toast.error("Nepodařilo se uložit jména");
                        return;
                    }
                    setShowNameDialog(false);
                }}
                onClear={async () => {
                    const ok = await clearOverrideNames();
                    if (!ok) {
                        toast.error("Nepodařilo se vymazat jména");
                        return;
                    }
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

export default function AdminCourt() {
    const { courtId } = useParams();

    if (!isCourtId(courtId)) {
        return <NotFound />;
    }

    return <AdminCourtContent courtId={courtId} />;
}
