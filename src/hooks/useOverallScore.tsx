import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const useOverallScore = () => {
    const [overallScoreA, setOverallScoreA] = useState<number | null>(null);
    const [overallScoreB, setOverallScoreB] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "match", "global"), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setOverallScoreA(data.overallScoreA ?? 0);
                setOverallScoreB(data.overallScoreB ?? 0);
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return { overallScoreA, overallScoreB, loading };
};
