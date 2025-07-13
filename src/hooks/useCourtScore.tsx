import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // odkaz na správnou Firebase instanci

interface CourtScore {
    teamA: number;
    teamB: number;
    setsA: number;
    setsB: number;
    currentSet: number;
    server: "home" | "away";
    pastSets: { teamA: number; teamB: number }[];
}

export const useCourtScore = (courtId: string) => {
    const [score, setScore] = useState<CourtScore>({
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

                    setScore({
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

    return { score, loading, error };
};
