import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCourtScore } from "../hooks/useCourtScore";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useMatchInfo } from "../hooks/useMatchInfo";
import { motion, AnimatePresence } from "framer-motion";
import { useOverrideNames } from "@/hooks/useOverrideNames";
import { TeamBox } from "@/components/TeamBox";
import { Button } from "@/components/ui/button";

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

    const getDisplayName = (team: "A" | "B") => {
        return team === "A"
            ? overrideNames.teamANameOverride || matchInfo.teamAName
            : overrideNames.teamBNameOverride || matchInfo.teamBName;
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
                    <Button onClick={handleLogin} className="w-full">
                        Přihlásit
                    </Button>
                    {error && <p className="text-destructive text-sm text-center">{error}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-8 p-6">
            <h1 className="text-3xl font-bold">Ovládání kurtu {courtId}</h1>

            <div className="flex flex-wrap gap-4">
                <Button
                    variant="outline"
                    onClick={() => setIsSwapped((prev) => !prev)}
                >
                    Prohodit zobrazení týmů
                </Button>
                <Button
                    onClick={() => {
                        setFormNames({
                            teamAName: overrideNames.teamANameOverride || "",
                            teamBName: overrideNames.teamBNameOverride || "",
                        });
                        setShowModal(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Upravit jména týmů
                </Button>
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
                                displayName={getDisplayName("B")}
                                scoreValue={score.teamB}
                                isServer={score.server === "away"}
                                onIncrement={() => updateScore("B", score.teamB + 1)}
                                onDecrement={() => updateScore("B", Math.max(0, score.teamB - 1))}
                            />
                            <TeamBox
                                displayName={getDisplayName("A")}
                                scoreValue={score.teamA}
                                isServer={score.server === "home"}
                                onIncrement={() => updateScore("A", score.teamA + 1)}
                                onDecrement={() => updateScore("A", Math.max(0, score.teamA - 1))}
                            />
                        </>
                    ) : (
                        <>
                            <TeamBox
                                displayName={getDisplayName("A")}
                                scoreValue={score.teamA}
                                isServer={score.server === "home"}
                                onIncrement={() => updateScore("A", score.teamA + 1)}
                                onDecrement={() => updateScore("A", Math.max(0, score.teamA - 1))}
                            />
                            <TeamBox
                                displayName={getDisplayName("B")}
                                scoreValue={score.teamB}
                                isServer={score.server === "away"}
                                onIncrement={() => updateScore("B", score.teamB + 1)}
                                onDecrement={() => updateScore("B", Math.max(0, score.teamB - 1))}
                            />
                        </>
                    )}
                </motion.div>
            </AnimatePresence>

            <Button
                onClick={toggleServer}
                className="bg-yellow-500 text-black hover:bg-yellow-600 font-medium"
            >
                Přepnout podávajícího
            </Button>

            <div className="flex flex-wrap gap-4 mt-4">
                <Button variant="outline" onClick={handleEndSet}>
                    Konec setu
                </Button>

                <Button
                    variant="destructive"
                    onClick={() => {
                        if (window.confirm("Opravdu chcete vynulovat celý zápas?")) {
                            resetMatch();
                        }
                    }}
                >
                    Resetovat zápas
                </Button>
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
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={async () => {
                                    await clearOverrideNames();
                                    setFormNames({ teamAName: "", teamBName: "" });
                                    setShowModal(false);
                                }}
                            >
                                Vymazat jména
                            </Button>
                            <div className="flex gap-2 ml-auto">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Zrušit
                                </Button>
                                <Button onClick={handleSaveOverrides}>
                                    Uložit
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
