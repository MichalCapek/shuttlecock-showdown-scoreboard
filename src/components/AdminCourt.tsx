import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCourtScore } from "../hooks/useCourtScore";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useMatchInfo } from "../hooks/useMatchInfo";
import { motion, AnimatePresence } from "framer-motion";
import {useOverrideNames} from "@/hooks/useOverrideNames.tsx";

export default function AdminCourt() {
    const { courtId } = useParams();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSwapped, setIsSwapped] = useState(false);
    const { matchInfo, loading: loadingMatch } = useMatchInfo();

    const { isAuthed, checkPassword } = useAdminAuth(courtId!);
    const { score, updateScore, setScore, resetMatch, toggleServer } = useCourtScore(courtId!);

    const { overrideNames, saveOverrideNames, clearOverrideNames, loading: loadingOverride } =
        useOverrideNames(courtId!);
    const [showModal, setShowModal] = useState(false);
    const [formNames, setFormNames] = useState({ teamAName: "", teamBName: "" });

    const handleSaveOverrides = async () => {
        await saveOverrideNames(formNames.teamAName, formNames.teamBName);
        setShowModal(false);
    };

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

    const TeamBox = ({
                         team,
                         scoreValue,
                         isServer,
                         onIncrement,
                         onDecrement,
                     }: {
        team: "A" | "B";
        scoreValue: number;
        isServer: boolean;
        onIncrement: () => void;
        onDecrement: () => void;
    }) => {
        const displayName =
            team === "A"
                ? overrideNames.teamANameOverride || matchInfo.teamAName
                : overrideNames.teamBNameOverride || matchInfo.teamBName;

        return (
            <div className="flex flex-col items-center p-4 border border-border rounded-xl bg-card shadow-sm w-64">
                <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">{displayName}</h2>
                <p className="text-4xl font-bold mb-4">{scoreValue}</p>
                <div className="flex flex-col items-center gap-2">
                    <button
                        onClick={onIncrement}
                        className="bg-primary text-white px-6 py-4 rounded-lg text-2xl font-bold hover:bg-primary/90 transition-all shadow-md"
                    >
                        +
                    </button>
                    <button
                        onClick={onDecrement}
                        className="bg-destructive text-white px-4 py-1 rounded text-sm hover:bg-destructive/90"
                    >
                        -
                    </button>
                </div>
                <div className="flex gap-4 p-4">
                    {isServer && (
                        <span className="text-sm px-3 py-1 bg-yellow-400 text-black rounded-full shadow-md font-semibold flex items-center gap-1">
                            🏸 Servis
                        </span>
                    )}
                </div>
            </div>
        );
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

            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => setIsSwapped((prev) => !prev)}
                    className="bg-muted border border-border text-sm px-4 py-2 rounded hover:bg-muted/80 transition-colors"
                >
                    Prohodit zobrazení týmů
                </button>
                <button
                    onClick={() => {
                        setFormNames({
                            teamAName: overrideNames.teamANameOverride || "",
                            teamBName: overrideNames.teamBNameOverride || "",
                        });
                        setShowModal(true);
                    }}
                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Upravit jména týmů
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={isSwapped ? "swapped" : "normal"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col md:flex-row gap-10"
                >
                    {isSwapped ? (
                        <>
                            <TeamBox
                                team="B"
                                scoreValue={score.teamB}
                                isServer={score.server === "away"}
                                onIncrement={() => updateScore("B", score.teamB + 1)}
                                onDecrement={() => updateScore("B", Math.max(0, score.teamB - 1))}
                            />
                            <TeamBox
                                team="A"
                                scoreValue={score.teamA}
                                isServer={score.server === "home"}
                                onIncrement={() => updateScore("A", score.teamA + 1)}
                                onDecrement={() => updateScore("A", Math.max(0, score.teamA - 1))}
                            />
                        </>
                    ) : (
                        <>
                            <TeamBox
                                team="A"
                                scoreValue={score.teamA}
                                isServer={score.server === "home"}
                                onIncrement={() => updateScore("A", score.teamA + 1)}
                                onDecrement={() => updateScore("A", Math.max(0, score.teamA - 1))}
                            />
                            <TeamBox
                                team="B"
                                scoreValue={score.teamB}
                                isServer={score.server === "away"}
                                onIncrement={() => updateScore("B", score.teamB + 1)}
                                onDecrement={() => updateScore("B", Math.max(0, score.teamB - 1))}
                            />
                        </>
                    )}
                </motion.div>
            </AnimatePresence>

            <button
                onClick={toggleServer}
                className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 font-medium"
            >
                Přepnout podávajícího
            </button>

            <div className="flex flex-wrap gap-4 mt-4">
                <button
                    onClick={handleEndSet}
                    className="bg-muted text-foreground px-6 py-2 rounded-lg border border-border hover:bg-muted/80 transition-colors font-medium"
                >
                    Konec setu
                </button>

                <button
                    onClick={() => {
                        if (window.confirm("Opravdu chcete vynulovat celý zápas?")) {
                            resetMatch();
                        }
                    }}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Resetovat zápas
                </button>
            </div>

            {score.pastSets && score.pastSets.length > 0 && (
                <div className="w-full max-w-md mt-6">
                    <h3 className="text-xl font-semibold mb-2">Předchozí sety</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        {score.pastSets.map((set, index) => (
                            <li key={index}>
                                Set {index + 1} – {set.teamA} : {set.teamB}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white text-black p-6 rounded-xl w-full max-w-md shadow-lg space-y-4">
                        <h2 className="text-xl font-semibold">Přepsat jména týmů</h2>
                        <input
                            type="text"
                            placeholder="Tým A"
                            className="w-full border px-3 py-2 rounded"
                            value={formNames.teamAName}
                            onChange={(e) => setFormNames({ ...formNames, teamAName: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Tým B"
                            className="w-full border px-3 py-2 rounded"
                            value={formNames.teamBName}
                            onChange={(e) => setFormNames({ ...formNames, teamBName: e.target.value })}
                        />
                        <div className="flex justify-between items-center pt-2 gap-2 flex-wrap">
                            <button
                                onClick={async () => {
                                    await clearOverrideNames();
                                    setFormNames({ teamAName: "", teamBName: "" });
                                    setShowModal(false);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            >
                                Vymazat jména
                            </button>
                            <div className="flex gap-2 ml-auto">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Zrušit
                                </button>
                                <button
                                    onClick={handleSaveOverrides}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Uložit
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
