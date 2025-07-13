import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCourtScore } from "../hooks/useCourtScore";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function AdminCourt() {
    const { courtId } = useParams();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { isAuthed, checkPassword } = useAdminAuth(courtId!);
    const { score, updateScore, setScore } = useCourtScore(courtId!);

    const handleLogin = async () => {
        const success = await checkPassword(password);
        if (!success) {
            setError("Nesprávné heslo");
        }
    };

    const handleEndSet = async () => {
        const confirmed = window.confirm("Opravdu chcete ukončit set?");
        if (!confirmed) return;

        const newPastSets = [...(score.pastSets || []), { teamA: score.teamA, teamB: score.teamB }];

        // Navýšit sady podle výsledku
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
    };


    if (!isAuthed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
                <div className="w-full max-w-md p-6 border border-border rounded-xl shadow-sm bg-card space-y-4">
                    <h1 className="text-2xl font-bold text-center">Přihlášení pro {courtId}</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Zadejte heslo"
                        className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                    >
                        Přihlásit
                    </button>
                    {error && <p className="text-destructive text-sm text-center">{error}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-8 p-6">
            <h1 className="text-3xl font-bold">Ovládání kurtu {courtId}</h1>

            <div className="flex flex-col md:flex-row gap-10">
                {/* Tým A */}
                <div className="flex flex-col items-center p-4 border border-border rounded-xl bg-card shadow-sm w-64">
                    <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        Tým A
                        {score.server === "home" && (
                            <span className="text-sm px-3 py-1 bg-yellow-400 text-black rounded-full shadow-md font-semibold flex items-center gap-1">
                                🏸 Servis
                            </span>
                        )}
                    </h2>
                    <p className="text-4xl font-bold mb-4">{score.teamA}</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => updateScore("A", score.teamA + 1)}
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                        >
                            +
                        </button>
                        <button
                            onClick={() => updateScore("A", Math.max(0, score.teamA - 1))}
                            className="bg-destructive text-white px-4 py-2 rounded hover:bg-destructive/90"
                        >
                            -
                        </button>
                    </div>
                </div>

                {/* Tým B */}
                <div className="flex flex-col items-center p-4 border border-border rounded-xl bg-card shadow-sm w-64">
                    <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        Tým B
                        {score.server === "away" && (
                            <span className="text-sm px-3 py-1 bg-yellow-400 text-black rounded-full shadow-md font-semibold flex items-center gap-1">
                                🏸 Servis
                            </span>
                        )}
                    </h2>
                    <p className="text-4xl font-bold mb-4">{score.teamB}</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => updateScore("B", score.teamB + 1)}
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                        >
                            +
                        </button>
                        <button
                            onClick={() => updateScore("B", Math.max(0, score.teamB - 1))}
                            className="bg-destructive text-white px-4 py-2 rounded hover:bg-destructive/90"
                        >
                            -
                        </button>
                    </div>
                </div>
            </div>

            {/* Konec setu */}
            <button
                onClick={handleEndSet}
                className="mt-4 bg-muted text-foreground px-6 py-2 rounded-lg border border-border hover:bg-muted/80 transition-colors font-medium"
            >
                Konec setu
            </button>

            {/* Výpis setů */}
            {score.pastSets && score.pastSets.length > 0 && (
                <div className="w-full max-w-md mt-6">
                    <h3 className="text-xl font-semibold mb-2">Předchozí sety</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        {score.pastSets.map((set, index) => (
                            <li key={index}>
                                Set {index + 1} – A: {set.teamA}, B: {set.teamB}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
