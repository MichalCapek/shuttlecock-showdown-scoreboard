import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";

interface MatchInfo {
    teamAName: string;
    teamBName: string;
    title: string;
    round: string;
    overallScoreA: number;
    overallScoreB: number;
    awayLogo: string;
}

interface CourtScore {
    teamA: number;
    teamB: number;
    setsA: number;
    setsB: number;
    currentSet: number;
    server: "home" | "away";
    pastSets: { teamA: number; teamB: number }[];
}

export default function AdminGlobal() {
    const [passwordInput, setPasswordInput] = useState("");
    const [isAuthed, setIsAuthed] = useState(false);
    const [globalData, setGlobalData] = useState<MatchInfo | null>(null);
    const [court1, setCourt1] = useState<CourtScore | null>(null);
    const [court2, setCourt2] = useState<CourtScore | null>(null);

    const handleLogin = async () => {
        const ref = doc(db, "admin", "global");
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().password === passwordInput) {
            setIsAuthed(true);
        } else {
            alert("Nesprávné heslo");
        }
    };

    useEffect(() => {
        const unsubGlobal = onSnapshot(doc(db, "match", "global"), (snap) => {
            if (snap.exists()) setGlobalData(snap.data() as MatchInfo);
        });
        const unsubCourt1 = onSnapshot(doc(db, "courts", "court1"), (snap) => {
            if (snap.exists()) setCourt1(snap.data() as CourtScore);
        });
        const unsubCourt2 = onSnapshot(doc(db, "courts", "court2"), (snap) => {
            if (snap.exists()) setCourt2(snap.data() as CourtScore);
        });

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
            await updateDoc(doc(db, "match", "global"), globalData);
            alert("Uloženo");
        } catch (err) {
            console.error("Chyba při ukládání:", err);
            alert("Nastala chyba při ukládání.");
        }
    };

    const handleInputChange = (key: keyof MatchInfo, value: string | number) => {
        setGlobalData((prev) =>
            prev ? { ...prev, [key]: value } : prev
        );
    };

    const handleResetCourts = async () => {
        const confirmed = confirm("Opravdu chcete resetovat oba kurty?");
        if (!confirmed) return;

        const empty: CourtScore = {
            teamA: 0,
            teamB: 0,
            setsA: 0,
            setsB: 0,
            currentSet: 1,
            pastSets: [],
            server: "home",
        };

        await setDoc(doc(db, "courts", "court1"), empty);
        await setDoc(doc(db, "courts", "court2"), empty);
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
                    <button onClick={handleLogin} className="w-full bg-primary text-white py-2 rounded">
                        Přihlásit
                    </button>
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
                    <button onClick={handleSubmit} className="bg-primary text-white px-4 py-2 rounded">
                        Uložit změny
                    </button>
                </div>

                {/* PRAVÝ SLOUPEC – Oba kurty */}
                <div className="space-y-6">
                    {[{ label: "Kurt 1", data: court1 }, { label: "Kurt 2", data: court2 }].map(({ label, data }, i) => (
                        <div key={i} className="bg-card border p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">{label}</h3>
                            {data ? (
                                <>
                                    <p>Skóre Domácí: {data.teamA} | Sety: {data.setsA}</p>
                                    <p>Skóre Hosté: {data.teamB} | Sety: {data.setsB}</p>
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
                    ))}
                    <button
                        onClick={handleResetCourts}
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                    >
                        Reset obou kurtů
                    </button>
                </div>
            </div>
        </div>
    );

}
