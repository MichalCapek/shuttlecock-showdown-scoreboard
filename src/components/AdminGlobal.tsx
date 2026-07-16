import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { useCourtScore } from "@/hooks/useCourtScore";
import { useMatchInfo } from "@/hooks/useMatchInfo";
import { useGlobalAdminAuth } from "@/hooks/useAdminAuth";
import { useOverrideNames } from "@/hooks/useOverrideNames";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { MatchInfoWithOverallScore } from "@/types";
import type { CourtId } from "@/lib/courts";
import { FIRESTORE_COLLECTIONS, FIRESTORE_DOCS, COURT_IDS } from "@/constants";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { CourtSummaryCard } from "@/components/admin/CourtSummaryCard";
import { TeamNameOverrideDialog } from "@/components/admin/TeamNameOverrideDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LoadingScreen } from "@/components/LoadingScreen";
import { getAvailableAwayLogos } from "@/lib/teamLogos";
import { resolveTeamName } from "@/lib/scoreboard";

export default function AdminGlobal() {
    const { isAuthed, checkPassword } = useGlobalAdminAuth();
    const { matchInfo, loading: matchLoading } = useMatchInfo();
    const court1 = useCourtScore(COURT_IDS.COURT_1);
    const court2 = useCourtScore(COURT_IDS.COURT_2);
    const { overrideNames: override1, saveOverrideNames: save1, clearOverrideNames: clear1 } =
        useOverrideNames(COURT_IDS.COURT_1);
    const { overrideNames: override2, saveOverrideNames: save2, clearOverrideNames: clear2 } =
        useOverrideNames(COURT_IDS.COURT_2);

    const [draft, setDraft] = useState<MatchInfoWithOverallScore | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [activeCourt, setActiveCourt] = useState<CourtId | null>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [tempOverride, setTempOverride] = useState({
        teamANameOverride: "",
        teamBNameOverride: "",
    });

    useEffect(() => {
        if (matchInfo && !isDirty) {
            setDraft(matchInfo);
        }
    }, [matchInfo, isDirty]);

    const handleInputChange = (key: keyof MatchInfoWithOverallScore, value: string | number) => {
        setIsDirty(true);
        setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    };

    const handleSubmit = async () => {
        if (!draft) {
            toast.error("Data nejsou připravena");
            return;
        }

        setSaving(true);
        try {
            await updateDoc(doc(db, FIRESTORE_COLLECTIONS.MATCH, FIRESTORE_DOCS.GLOBAL), { ...draft });
            setIsDirty(false);
            toast.success("Změny uloženy");
        } catch (err) {
            console.error("Chyba při ukládání:", err);
            toast.error("Nastala chyba při ukládání");
        } finally {
            setSaving(false);
        }
    };

    const handleResetCourts = async () => {
        const ok1 = await court1.resetMatch();
        const ok2 = await court2.resetMatch();
        setShowResetConfirm(false);
        if (!ok1 || !ok2) {
            toast.error("Nepodařilo se resetovat jeden nebo oba kurty");
            return;
        }
        toast.success("Oba kurty byly resetovány");
    };

    const handleClearOverrides = async (courtId: CourtId) => {
        const fn = courtId === COURT_IDS.COURT_1 ? clear1 : clear2;
        const ok = await fn();
        if (!ok) {
            toast.error("Nepodařilo se vymazat přepsaná jména");
            return;
        }
        toast.success(`Přepsaná jména na ${courtId === COURT_IDS.COURT_1 ? "Kurtu 1" : "Kurtu 2"} byla vymazána`);
    };

    const openModal = (courtId: CourtId) => {
        const data = courtId === COURT_IDS.COURT_1 ? override1 : override2;
        setTempOverride({
            teamANameOverride: data.teamANameOverride || "",
            teamBNameOverride: data.teamBNameOverride || "",
        });
        setActiveCourt(courtId);
    };

    const saveOverride = async () => {
        if (!activeCourt) return;
        const fn = activeCourt === COURT_IDS.COURT_1 ? save1 : save2;
        const ok = await fn(tempOverride.teamANameOverride, tempOverride.teamBNameOverride);
        if (!ok) {
            toast.error("Nepodařilo se uložit jména");
            return;
        }
        setActiveCourt(null);
        toast.success("Jména uložena");
    };

    const getTeamName = (courtId: CourtId, team: "A" | "B") => {
        if (!draft) return "—";
        const overrides = courtId === COURT_IDS.COURT_1 ? override1 : override2;
        return resolveTeamName(team, draft, overrides);
    };

    if (!isAuthed) {
        return (
            <AdminLogin
                title="Globální administrace"
                description="Správa turnaje, týmů a celkového skóre"
                onLogin={checkPassword}
            />
        );
    }

    if (matchLoading || !draft) {
        return <LoadingScreen />;
    }

    return (
        <AdminLayout
            title="Globální správa utkání"
            description="Nastavení turnaje, celkového skóre a přehled kurtů"
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Nastavení zápasu</CardTitle>
                        <CardDescription>
                            Informace zobrazené na scoreboardu
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <fieldset className="space-y-4">
                            <legend className="text-sm font-semibold text-muted-foreground">
                                Turnaj
                            </legend>
                            <div className="space-y-2">
                                <Label htmlFor="title">Název turnaje</Label>
                                <Input
                                    id="title"
                                    value={draft.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="round">Kolo</Label>
                                <Input
                                    id="round"
                                    value={draft.round}
                                    onChange={(e) => handleInputChange("round", e.target.value)}
                                />
                            </div>
                        </fieldset>

                        <Separator />

                        <fieldset className="space-y-4">
                            <legend className="text-sm font-semibold text-muted-foreground">
                                Týmy
                            </legend>
                            <div className="space-y-2">
                                <Label htmlFor="teamA">Tým A (domácí)</Label>
                                <Input
                                    id="teamA"
                                    value={draft.teamAName}
                                    onChange={(e) => handleInputChange("teamAName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="teamB">Tým B (hosté)</Label>
                                <Input
                                    id="teamB"
                                    value={draft.teamBName}
                                    onChange={(e) => handleInputChange("teamBName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="awayLogo">Logo B (název souboru)</Label>
                                <Input
                                    id="awayLogo"
                                    value={draft.awayLogo || ""}
                                    onChange={(e) => handleInputChange("awayLogo", e.target.value)}
                                    placeholder="např. KLI_logo.png"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Soubor musí být ve složce{" "}
                                    <code className="rounded bg-muted px-1">assets/</code>. Dostupné:{" "}
                                    {getAvailableAwayLogos()
                                        .filter((name) => !name.includes("benatky") && name !== "shuttlecock.png")
                                        .join(", ")}
                                </p>
                            </div>
                        </fieldset>

                        <Separator />

                        <fieldset className="space-y-4">
                            <legend className="text-sm font-semibold text-muted-foreground">
                                Celkové skóre utkání
                            </legend>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="overallA">Skóre A</Label>
                                    <Input
                                        id="overallA"
                                        type="number"
                                        min={0}
                                        value={draft.overallScoreA}
                                        onChange={(e) =>
                                            handleInputChange("overallScoreA", parseInt(e.target.value) || 0)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="overallB">Skóre B</Label>
                                    <Input
                                        id="overallB"
                                        type="number"
                                        min={0}
                                        value={draft.overallScoreB}
                                        onChange={(e) =>
                                            handleInputChange("overallScoreB", parseInt(e.target.value) || 0)
                                        }
                                    />
                                </div>
                            </div>
                        </fieldset>

                        <div className="sticky bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-10 -mx-1 bg-card/95 px-1 py-2 backdrop-blur-sm sm:static sm:mx-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
                            <Button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="min-h-[44px] w-full gap-2 bg-brand-blue hover:bg-brand-blue/90"
                            >
                                <Save className="h-4 w-4" />
                                {saving ? "Ukládám…" : "Uložit změny"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <CourtSummaryCard
                        courtId={COURT_IDS.COURT_1}
                        label="Kurt 1"
                        data={court1.score}
                        teamAName={getTeamName(COURT_IDS.COURT_1, "A")}
                        teamBName={getTeamName(COURT_IDS.COURT_1, "B")}
                        onEditNames={() => openModal(COURT_IDS.COURT_1)}
                        onClearOverrides={() => handleClearOverrides(COURT_IDS.COURT_1)}
                    />
                    <CourtSummaryCard
                        courtId={COURT_IDS.COURT_2}
                        label="Kurt 2"
                        data={court2.score}
                        teamAName={getTeamName(COURT_IDS.COURT_2, "A")}
                        teamBName={getTeamName(COURT_IDS.COURT_2, "B")}
                        onEditNames={() => openModal(COURT_IDS.COURT_2)}
                        onClearOverrides={() => handleClearOverrides(COURT_IDS.COURT_2)}
                    />

                    <Card className="border-destructive/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base text-destructive">Nebezpečná zóna</CardTitle>
                            <CardDescription>
                                Resetuje skóre, sety a historii na obou kurtách
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="destructive"
                                onClick={() => setShowResetConfirm(true)}
                                className="min-h-[44px] w-full gap-2 xs:w-auto"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Reset obou kurtů
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <TeamNameOverrideDialog
                open={activeCourt !== null}
                onOpenChange={(open) => !open && setActiveCourt(null)}
                title={`Přepsání jmen – ${activeCourt === COURT_IDS.COURT_1 ? "Kurt 1" : activeCourt === COURT_IDS.COURT_2 ? "Kurt 2" : ""}`}
                description="Přepsaná jména se zobrazí na vybraném kurtu na scoreboardu, streamu i court view"
                teamAName={tempOverride.teamANameOverride}
                teamBName={tempOverride.teamBNameOverride}
                onTeamAChange={(v) => setTempOverride((p) => ({ ...p, teamANameOverride: v }))}
                onTeamBChange={(v) => setTempOverride((p) => ({ ...p, teamBNameOverride: v }))}
                onSave={saveOverride}
            />

            <ConfirmDialog
                open={showResetConfirm}
                onOpenChange={setShowResetConfirm}
                title="Resetovat oba kurty?"
                description="Tato akce vynuluje skóre, sety i historii na obou kurtách. Nelze ji vrátit zpět."
                confirmLabel="Resetovat oba kurty"
                destructive
                onConfirm={handleResetCourts}
            />
        </AdminLayout>
    );
}
