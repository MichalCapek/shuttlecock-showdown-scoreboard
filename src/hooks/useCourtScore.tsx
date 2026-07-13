import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CourtScore } from "@/types";
import { DEFAULT_COURT_SCORE, FIRESTORE_COLLECTIONS } from "@/constants";
import { parseCourtDoc } from "@/lib/match";
import { computeEndSetUpdate } from "@/lib/scoreboard";

export function useCourtScore(courtId: string) {
    const [score, setScoreState] = useState<CourtScore>(DEFAULT_COURT_SCORE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.COURTS, courtId);

        const unsubscribe = onSnapshot(
            docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setScoreState(parseCourtDoc(docSnap.data()));
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

    const updateScore = async (team: "A" | "B", newScore: number): Promise<boolean> => {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.COURTS, courtId);

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
            return true;
        } catch (err) {
            console.error("Chyba při aktualizaci skóre:", err);
            return false;
        }
    };

    const endSet = async (): Promise<boolean> => {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.COURTS, courtId);

        try {
            await updateDoc(docRef, computeEndSetUpdate(score));
            return true;
        } catch (err) {
            console.error("Chyba při ukončení setu:", err);
            return false;
        }
    };

    const setScore = async (newScore: CourtScore): Promise<boolean> => {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.COURTS, courtId);
        try {
            await setDoc(docRef, newScore, { merge: true });
            return true;
        } catch (err) {
            console.error("Chyba při nastavování skóre:", err);
            return false;
        }
    };

    const resetMatch = async (): Promise<boolean> => {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.COURTS, courtId);
        const resetData: CourtScore = { ...DEFAULT_COURT_SCORE };

        try {
            await setDoc(docRef, resetData, { merge: true });
            return true;
        } catch (err) {
            console.error("Chyba při resetování zápasu:", err);
            return false;
        }
    };

    const toggleServer = async (): Promise<boolean> => {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.COURTS, courtId);
        const newServer: CourtScore["server"] = score.server === "home" ? "away" : "home";

        try {
            await setDoc(docRef, { server: newServer }, { merge: true });
            return true;
        } catch (err) {
            console.error("Chyba při přepínání servera:", err);
            return false;
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
}
