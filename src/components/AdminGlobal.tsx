import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useOverrideNames } from "../hooks/useOverrideNames";
import { Button } from "@/components/ui/button";
import type { CourtScore, MatchInfo } from "@/types";
import { FIRESTORE_COLLECTIONS, FIRESTORE_DOCS, DEFAULT_COURT_SCORE, COURT_IDS } from "@/constants";

interface MatchInfoWithScore extends MatchInfo {
    overallScoreA: number;
    overallScoreB: number;
}

export default function AdminGlobal() {
    const [passwordInput, setPasswordInput] = useState("");
    const [isAuthed, setIsAuthed] = useState(false);
    const [globalData, setGlobalData] = useState<MatchInfoWithScore | null>(null);
    const [court1, setCourt1] = useState<CourtScore | null>(null);
    const [court2, setCourt2] = useState<CourtScore | null>(null);
    const [activeCourt, setActiveCourt] = useState<"court1" | "court2" | null>(null);

    const { overrideNames: override1, saveOverrideNames: save1 } = useOverrideNames(COURT_IDS.COURT_1);
    const { overrideNames: override2, saveOverrideNames: save2 } = useOverrideNames(COURT_IDS.COURT_2);

    const [tempOverride, setTempOverride] = useState({
        teamANameOverride: "",
        teamBNameOverride: "",
    });

    const handleLogin = async () => {
        const ref = doc(db, FIRESTORE_COLLECTIONS.ADMIN, FIRESTORE_DOCS.GLOBAL);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().password === passwordInput) {
            setIsAuthed(true);
        } else {
            alert("Nesprávné heslo");
        }
    };

    const handleClearOverrides = async (courtId: "court1" | "court2") => {
        const fn = courtId === "court1" ? save1 : save2;
        await fn("", "");
        alert(`Přepsaná jména na ${courtId} byla vymazána.`);
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
            alert("Data nejsou připravena");
            return;
        }

        try {
            await updateDoc(doc(db, FIRESTORE_COLLECTIONS.MATCH, FIRESTORE_DOCS.GLOBAL), globalData);
            alert("Uloženo");
        } catch (err) {
            console.error("Chyba při ukládání:", err);
            alert("Nastala chyba při ukládání.");
        }
    };

    const handleInputChange = (key: keyof MatchInfoWithScore, value: string | number) => {
        setGlobalData((prev) => (prev ? { ...prev, [key]: value } : prev));
    };

    const handleResetCourts = async () => {
        const confirmed = confirm("Opravdu chcete resetovat oba kurty?");
        if (!confirmed) return;

        await setDoc(doc(db, FIRESTORE_COLLECTIONS.COURTS, COURT_IDS.COURT_1), DEFAULT_COURT_SCORE);
        await setDoc(doc(db, FIRESTORE_COLLECTIONS.COURTS, COURT_IDS.COURT_2), DEFAULT_COURT_SCORE);
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
    };

    if (!isAuthed) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="bg-card border p-6 rounded-lg w-full max-w-md space-y-4">
                    <h2 className="text-xl font-semibold text-center">Admin – Global</h2>
                    <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Zadejte heslo"
                        className="w-full px-4 py-2 border rounded"
                    />
                    <Button onClick={handleLogin} className="w-full">
                        Přihlásit
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6 space-y-8">
            <h1 className="text-2xl font-bold">Globální správa utkání</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEVÝ SLOUPEC – Globální nastavení */}
                <div className="bg-card border p-4 rounded-lg space-y-4">
                    <h2 className="text-xl font-semibold mb-2">Nastavení zápasu</h2>
                    {/* Formulář pro globální data... (nezměněno) */}
                    <div>
                        <label className="block font-semibold">Název turnaje</label>
                        <input
                            value={globalData?.title || ""}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Kolo</label>
                        <input
                            value={globalData?.round || ""}
                            onChange={(e) => handleInputChange("round", e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Tým A</label>
                        <input
                            value={globalData?.teamAName || ""}
                            onChange={(e) => handleInputChange("teamAName", e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Tým B</label>
                        <input
                            value={globalData?.teamBName || ""}
                            onChange={(e) => handleInputChange("teamBName", e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Logo B (název souboru)</label>
                        <input
                            value={globalData?.awayLogo || ""}
                            onChange={(e) => handleInputChange("awayLogo", e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold">Skóre A</label>
                            <input
                                type="number"
                                value={globalData?.overallScoreA ?? 0}
                                onChange={(e) =>
                                    handleInputChange("overallScoreA", parseInt(e.target.value) || 0)
                                }
                                className="w-full border px-4 py-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Skóre B</label>
                            <input
                                type="number"
                                value={globalData?.overallScoreB ?? 0}
                                onChange={(e) =>
                                    handleInputChange("overallScoreB", parseInt(e.target.value) || 0)
                                }
                                className="w-full border px-4 py-2 rounded"
                            />
                        </div>
                    </div>
                    <Button onClick={handleSubmit}>
                        Uložit změny
                    </Button>
                </div>

                {/* PRAVÝ SLOUPEC – Oba kurty */}
                <div className="space-y-6">
                    {[{ label: "Kurt 1", data: court1, id: "court1" }, { label: "Kurt 2", data: court2, id: "court2" }].map(
                        ({ label, data, id }) => (
                            <div key={id} className="bg-card border p-4 rounded-lg space-y-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold">{label}</h3>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => openModal(id as "court1" | "court2")}
                                            className="text-blue-600 p-0 h-auto"
                                        >
                                            Přepsat jména
                                        </Button>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => handleClearOverrides(id as "court1" | "court2")}
                                            className="text-red-600 p-0 h-auto"
                                        >
                                            Vymazat přepis
                                        </Button>
                                    </div>
                                </div>
                                {data ? (
                                    <>
                                        <p>
                                            <span className="font-semibold">Tým A:</span>{" "}
                                            {(id === "court1" ? override1.teamANameOverride : override2.teamANameOverride) || globalData?.teamAName || "—"} — skóre: {data.teamA}, sety: {data.setsA}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Tým B:</span>{" "}
                                            {(id === "court1" ? override1.teamBNameOverride : override2.teamBNameOverride) || globalData?.teamBName || "—"} — skóre: {data.teamB}, sety: {data.setsB}
                                        </p>
                                        <p>Aktuální set: {data.currentSet}</p>
                                        <p>Servis: {data.server}</p>
                                        {data.pastSets?.length > 0 && (
                                            <div className="mt-2">
                                                <p className="font-semibold">Odehrané sety:</p>
                                                <p>{data.pastSets.map((s) => `${s.teamA}:${s.teamB}`).join(", ")}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p>Načítám...</p>
                                )}
                            </div>
                        )
                    )}
                    <Button variant="destructive" onClick={handleResetCourts}>
                        Reset obou kurtů
                    </Button>
                </div>
            </div>

            {/* MODÁLNÍ OKNO */}
            {activeCourt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4 text-black">
                        <h3 className="text-xl font-bold">Přepsání jmen pro {activeCourt}</h3>
                        <div>
                            <label className="block font-semibold mb-1">Tým A</label>
                            <div className="relative">
                                <input
                                    className="w-full border px-4 py-2 pr-10 rounded"
                                    value={tempOverride.teamANameOverride}
                                    onChange={(e) =>
                                        setTempOverride((prev) => ({ ...prev, teamANameOverride: e.target.value }))
                                    }
                                />
                                {tempOverride.teamANameOverride && (
                                    <button
                                        className="absolute right-2 top-2 text-gray-500 hover:text-black"
                                        onClick={() =>
                                            setTempOverride((prev) => ({ ...prev, teamANameOverride: "" }))
                                        }
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Tým B</label>
                            <div className="relative">
                                <input
                                    className="w-full border px-4 py-2 pr-10 rounded"
                                    value={tempOverride.teamBNameOverride}
                                    onChange={(e) =>
                                        setTempOverride((prev) => ({ ...prev, teamBNameOverride: e.target.value }))
                                    }
                                />
                                {tempOverride.teamBNameOverride && (
                                    <button
                                        className="absolute right-2 top-2 text-gray-500 hover:text-black"
                                        onClick={() =>
                                            setTempOverride((prev) => ({ ...prev, teamBNameOverride: "" }))
                                        }
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setActiveCourt(null)}>
                                Zrušit
                            </Button>
                            <Button onClick={saveOverride}>
                                Uložit
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
