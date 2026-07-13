import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { MatchInfoWithOverallScore } from "@/types";
import { FIRESTORE_COLLECTIONS, FIRESTORE_DOCS } from "@/constants";
import { parseMatchDoc } from "@/lib/match";

export function useMatchInfo() {
    const [matchInfo, setMatchInfo] = useState<MatchInfoWithOverallScore | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.MATCH, FIRESTORE_DOCS.GLOBAL);

        const unsubscribe = onSnapshot(
            docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setMatchInfo(parseMatchDoc(docSnap.data()));
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
}
