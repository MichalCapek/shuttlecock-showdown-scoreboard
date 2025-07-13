import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCourtScore } from "../hooks/useCourtScore";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function AdminCourt() {
    const { courtId } = useParams();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { isAuthed, checkPassword } = useAdminAuth(courtId!);
    const { score, updateScore } = useCourtScore(courtId!);

    const handleLogin = async () => {
        const success = await checkPassword(password);
        if (!success) {
            setError("Nesprávné heslo");
        }
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
                    <h2 className="font-semibold text-lg mb-2">Tým A</h2>
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
                    <h2 className="font-semibold text-lg mb-2">Tým B</h2>
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
        </div>
    );
}
