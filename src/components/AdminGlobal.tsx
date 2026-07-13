import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { db } from "../../firebaseConfig";
import { useOverrideNames } from "../hooks/useOverrideNames";
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
import type { CourtScore, MatchInfo } from "@/types";
import { FIRESTORE_COLLECTIONS, FIRESTORE_DOCS, DEFAULT_COURT_SCORE, COURT_IDS } from "@/constants";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { CourtSummaryCard } from "@/components/admin/CourtSummaryCard";
import { TeamNameOverrideDialog } from "@/components/admin/TeamNameOverrideDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface MatchInfoWithScore extends MatchInfo {
    overallScoreA: number;
    overallScoreB: number;
}

export default function AdminGlobal() {
    const [isAuthed, setIsAuthed] = useState(false);
    const [globalData, setGlobalData] = useState<MatchInfoWithScore | null>(null);
    const [court1, setCourt1] = useState<CourtScore | null>(null);
    const [court2, setCourt2] = useState<CourtScore | null>(null);
    const [activeCourt, setActiveCourt] = useState<"court1" | "court2" | null>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [saving, setSaving] = useState(false);

    const { overrideNames: override1, saveOverrideNames: save1 } = useOverrideNames(COURT_IDS.COURT_1);
    const { overrideNames: override2, saveOverrideNames: save2 } = useOverrideNames(COURT_IDS.COURT_2);

    const [tempOverride, setTempOverride] = useState({
        teamANameOverride: "",
        teamBNameOverride: "",
    });

    const handleLogin = async (password: string) => {
        const ref = doc(db, FIRESTORE_COLLECTIONS.ADMIN, FIRESTORE_DOCS.GLOBAL);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().password === password) {
            setIsAuthed(true);
            return true;
        }
        return false;
    };

    useEffect(() => {
        const unsubGlobal = onSnapshot(
            doc(db, FIRESTORE_COLLECTIONS.MATCH, FIRESTORE_DOCS.GLOBAL),
            (snap) => {
                if (snap.exists()) setGlobalData(snap.data() as MatchInfoWithScore);
            }
        );
        const unsubCourt1 = onSnapshot(
            doc(db, FIRESTORE_COLLECTIONS.COURTS, COURT_IDS.COURT_1),
            (snap) => {
                if (snap.exists()) setCourt1(snap.data() as CourtScore);
            }
        );
        const unsubCourt2 = onSnapshot(
            doc(db, FIRESTORE_COLLECTIONS.COURTS, COURT_IDS.COURT_2),
            (snap) => {
                if (snap.exists()) setCourt2(snap.data() as CourtScore);
            }
        );

        return () => {
            unsubGlobal();
            unsubCourt1();
            unsubCourt2();
        };
    }, []);

    const handleSubmit = async () => {
        if (!globalData) {
            toast.error("Data nejsou připravena");
            return;
        }

        setSaving(true);
        try {
            await updateDoc(doc(db, FIRESTORE_COLLECTIONS.MATCH, FIRESTORE_DOCS.GLOBAL), { ...globalData });
            toast.success("Změny uloženy");
        } catch (err) {
            console.error("Chyba při ukládání:", err);
            toast.error("Nastala chyba při ukládání");
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (key: keyof MatchInfoWithScore, value: string | number) => {
        setGlobalData((prev) => (prev ? { ...prev, [key]: value } : prev));
    };

    const handleResetCourts = async () => {
        await setDoc(doc(db, FIRESTORE_COLLECTIONS.COURTS, COURT_IDS.COURT_1), DEFAULT_COURT_SCORE);
        await setDoc(doc(db, FIRESTORE_COLLECTIONS.COURTS, COURT_IDS.COURT_2), DEFAULT_COURT_SCORE);
        setShowResetConfirm(false);
        toast.success("Oba kurty byly resetovány");
    };

    const handleClearOverrides = async (courtId: "court1" | "court2") => {
        const fn = courtId === "court1" ? save1 : save2;
        await fn("", "");
        toast.success(`Přepsaná jména na ${courtId === "court1" ? "Kurtu 1" : "Kurtu 2"} byla vymazána`);
    };

    const openModal = (courtId: "court1" | "court2") => {
        const data = courtId === "court1" ? override1 : override2;
        setTempOverride({
            teamANameOverride: data.teamANameOverride || "",
            teamBNameOverride: data.teamBNameOverride || "",
        });
        setActiveCourt(courtId);
    };

    const saveOverride = async () => {
        if (!activeCourt) return;
        const fn = activeCourt === "court1" ? save1 : save2;
        await fn(tempOverride.teamANameOverride, tempOverride.teamBNameOverride);
        setActiveCourt(null);
        toast.success("Jména uložena");
    };

    if (!isAuthed) {
        return (
            <AdminLogin
                title="Globální administrace"
                description="Správa turnaje, týmů a celkového skóre"
                onLogin={handleLogin}
            />
        );
    }

    const getTeamName = (court: "court1" | "court2", team: "A" | "B") => {
        const overrides = court === "court1" ? override1 : override2;
        const override = team === "A" ? overrides.teamANameOverride : overrides.teamBNameOverride;
        const defaultName = team === "A" ? globalData?.teamAName : globalData?.teamBName;
        return override || defaultName || "—";
    };

    return (
        <AdminLayout
            title="Globální správa utkání"
            description="Nastavení turnaje, celkového skóre a přehled kurtů"
        >
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Match settings */}
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
                                    value={globalData?.title || ""}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="round">Kolo</Label>
                                <Input
                                    id="round"
                                    value={globalData?.round || ""}
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
                                    value={globalData?.teamAName || ""}
                                    onChange={(e) => handleInputChange("teamAName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="teamB">Tým B (hosté)</Label>
                                <Input
                                    id="teamB"
                                    value={globalData?.teamBName || ""}
                                    onChange={(e) => handleInputChange("teamBName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="awayLogo">Logo B (název souboru)</Label>
                                <Input
                                    id="awayLogo"
                                    value={globalData?.awayLogo || ""}
                                    onChange={(e) => handleInputChange("awayLogo", e.target.value)}
                                    placeholder="např. team-b.png"
                                />
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
                                        value={globalData?.overallScoreA ?? 0}
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
                                        value={globalData?.overallScoreB ?? 0}
                                        onChange={(e) =>
                                            handleInputChange("overallScoreB", parseInt(e.target.value) || 0)
                                        }
                                    />
                                </div>
                            </div>
                        </fieldset>

                        <Button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="w-full gap-2 bg-brand-blue hover:bg-brand-blue/90"
                        >
                            <Save className="h-4 w-4" />
                            {saving ? "Ukládám…" : "Uložit změny"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Courts overview */}
                <div className="space-y-4">
                    <CourtSummaryCard
                        courtId={COURT_IDS.COURT_1}
                        label="Kurt 1"
                        data={court1}
                        teamAName={getTeamName("court1", "A")}
                        teamBName={getTeamName("court1", "B")}
                        onEditNames={() => openModal("court1")}
                        onClearOverrides={() => handleClearOverrides("court1")}
                    />
                    <CourtSummaryCard
                        courtId={COURT_IDS.COURT_2}
                        label="Kurt 2"
                        data={court2}
                        teamAName={getTeamName("court2", "A")}
                        teamBName={getTeamName("court2", "B")}
                        onEditNames={() => openModal("court2")}
                        onClearOverrides={() => handleClearOverrides("court2")}
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
                                className="gap-2"
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
                title={`Přepsání jmen – ${activeCourt === "court1" ? "Kurt 1" : activeCourt === "court2" ? "Kurt 2" : ""}`}
                description="Přepsaná jména se zobrazí pouze na vybraném kurtu"
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
