import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export interface CourtScore {
    teamA: number;
    teamB: number;
    setsA: number;
    setsB: number;
    currentSet: number;
    server: "home" | "away";
    pastSets: { teamA: number; teamB: number }[];
}

export const useCourtScore = (courtId: string) => {
    const [score, setScoreState] = useState<CourtScore>({
        teamA: 0,
        teamB: 0,
        setsA: 0,
        setsB: 0,
        currentSet: 1,
        server: "home",
        pastSets: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const docRef = doc(db, "courts", courtId);

        const unsubscribe = onSnapshot(
            docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();

                    setScoreState({
                        teamA: data.teamA ?? 0,
                        teamB: data.teamB ?? 0,
                        setsA: data.setsA ?? 0,
                        setsB: data.setsB ?? 0,
                        currentSet: data.currentSet ?? 1,
                        server: data.server ?? "home",
                        pastSets: data.pastSets ?? [],
                    });

                    setError(null);
                } else {
                    setError(`Dokument courts/${courtId} neexistuje.`);
                }
                setLoading(false);
            },
            (err) => {
                console.error("Realtime listener error:", err);
                setError("Chyba při načítání skóre.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [courtId]);

    const updateScore = async (team: "A" | "B", newScore: number) => {
        const docRef = doc(db, "courts", courtId);

        try {
            const updatePayload: Partial<CourtScore> = {};

            if (team === "A") {
                updatePayload.teamA = newScore;
            } else {
                updatePayload.teamB = newScore;
            }

            const currentScore = team === "A" ? score.teamA : score.teamB;
            const isAddingPoint = newScore > currentScore;

            if (isAddingPoint) {
                updatePayload.server = team === "A" ? "home" : "away";
            }

            await updateDoc(docRef, updatePayload);
        } catch (err) {
            console.error("Chyba při aktualizaci skóre:", err);
        }
    };

    const endSet = async () => {
        const docRef = doc(db, "courts", courtId);

        const pastSets = [...score.pastSets, { teamA: score.teamA, teamB: score.teamB }];
        const setsA = score.teamA > score.teamB ? score.setsA + 1 : score.setsA;
        const setsB = score.teamB > score.teamA ? score.setsB + 1 : score.setsB;

        const updated: Partial<CourtScore> = {
            teamA: 0,
            teamB: 0,
            setsA,
            setsB,
            currentSet: score.currentSet + 1,
            pastSets,
        };

        try {
            await updateDoc(docRef, updated);
        } catch (err) {
            console.error("Chyba při ukončení setu:", err);
        }
    };

    const setScore = async (newScore: CourtScore) => {
        const docRef = doc(db, "courts", courtId);
        try {
            await setDoc(docRef, newScore, { merge: true });
        } catch (err) {
            console.error("Chyba při nastavování skóre:", err);
        }
    };

    const resetMatch = async () => {
        const docRef = doc(db, "courts", courtId);

        const resetData: CourtScore = {
            teamA: 0,
            teamB: 0,
            setsA: 0,
            setsB: 0,
            currentSet: 1,
            server: "home",
            pastSets: [],
        };

        try {
            await setDoc(docRef, resetData, { merge: true });
        } catch (err) {
            console.error("Chyba při resetování zápasu:", err);
        }
    };

    const toggleServer = async () => {
        const docRef = doc(db, "courts", courtId);
        const newServer: CourtScore["server"] = score.server === "home" ? "away" : "home";

        try {
            await setDoc(docRef, { server: newServer }, { merge: true });
        } catch (err) {
            console.error("Chyba při přepínání servera:", err);
        }
    };


    return {
        score,
        loading,
        error,
        updateScore,
        endSet,
        setScore,
        resetMatch,
        toggleServer,
    };
};
