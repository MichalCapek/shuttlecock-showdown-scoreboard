import { useEffect, useState } from "react";
import { doc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export function useOverrideNames(courtId: string) {
    const [overrideNames, setOverrideNamesState] = useState<{
        teamANameOverride: string;
        teamBNameOverride: string;
    }>({ teamANameOverride: "", teamBNameOverride: "" });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!courtId) return;

        const ref = doc(db, "courts", courtId, "overrideNames", "names");

        const unsubscribe = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setOverrideNamesState({
                    teamANameOverride: data.teamANameOverride || "",
                    teamBNameOverride: data.teamBNameOverride || "",
                });
            } else {
                setOverrideNamesState({
                    teamANameOverride: "",
                    teamBNameOverride: "",
                });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [courtId]);

    const saveOverrideNames = async (
        teamANameOverride: string,
        teamBNameOverride: string
    ) => {
        const ref = doc(db, "courts", courtId, "overrideNames", "names");
        await setDoc(ref, { teamANameOverride, teamBNameOverride });
        // `onSnapshot` se postará o aktualizaci lokálního stavu
    };

    const clearOverrideNames = async () => {
        const ref = doc(db, "courts", courtId, "overrideNames", "names");
        await deleteDoc(ref);
        setOverrideNamesState({ teamANameOverride: "", teamBNameOverride: "" });
    };

    return { overrideNames, saveOverrideNames, clearOverrideNames, loading };
}
