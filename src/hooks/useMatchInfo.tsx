import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // ujisti se, že to odkazuje na správný Firestore instance

interface MatchInfo {
    teamAName: string;
    teamBName: string;
    title: string;
    round: string;
    overallScoreA: number;
    overallScoreB: number;
    awayLogo: string;
}

export const useMatchInfo = () => {
    const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const docRef = doc(db, "match", "global");

        const unsubscribe = onSnapshot(
            docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();

                    setMatchInfo({
                        teamAName: data.teamAName ?? "Tým A",
                        teamBName: data.teamBName ?? "Tým B",
                        title: data.title ?? "Zápas",
                        round: data.round ?? "",
                        overallScoreA: data.overallScoreA ?? 0,
                        overallScoreB: data.overallScoreB ?? 0,
                        awayLogo: data.awayLogo ?? "https://via.placeholder.com/150",
                    });
                    setError(null);
                } else {
                    setError("Dokument /match/global neexistuje.");
                }
                setLoading(false);
            },
            (err) => {
                console.error("Realtime listener error:", err);
                setError("Chyba při načítání dat.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { matchInfo, loading, error };
};
