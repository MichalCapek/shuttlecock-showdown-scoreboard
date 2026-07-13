import { useEffect, useState } from "react";
import { doc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import type { OverrideNames } from "@/types";
import { FIRESTORE_COLLECTIONS, FIRESTORE_DOCS } from "@/constants";

const DEFAULT_OVERRIDE_NAMES: OverrideNames = {
    teamANameOverride: "",
    teamBNameOverride: "",
};

export function useOverrideNames(courtId: string) {
    const [overrideNames, setOverrideNamesState] = useState<OverrideNames>(DEFAULT_OVERRIDE_NAMES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!courtId) return;

        const ref = doc(
            db,
            FIRESTORE_COLLECTIONS.COURTS,
            courtId,
            FIRESTORE_DOCS.OVERRIDE_NAMES,
            FIRESTORE_DOCS.NAMES
        );

        const unsubscribe = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setOverrideNamesState({
                    teamANameOverride: data.teamANameOverride || "",
                    teamBNameOverride: data.teamBNameOverride || "",
                });
            } else {
                setOverrideNamesState(DEFAULT_OVERRIDE_NAMES);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [courtId]);

    const saveOverrideNames = async (
        teamANameOverride: string,
        teamBNameOverride: string
    ) => {
        const ref = doc(
            db,
            FIRESTORE_COLLECTIONS.COURTS,
            courtId,
            FIRESTORE_DOCS.OVERRIDE_NAMES,
            FIRESTORE_DOCS.NAMES
        );
        await setDoc(ref, { teamANameOverride, teamBNameOverride });
    };

    const clearOverrideNames = async () => {
        const ref = doc(
            db,
            FIRESTORE_COLLECTIONS.COURTS,
            courtId,
            FIRESTORE_DOCS.OVERRIDE_NAMES,
            FIRESTORE_DOCS.NAMES
        );
        await deleteDoc(ref);
        setOverrideNamesState(DEFAULT_OVERRIDE_NAMES);
    };

    return { overrideNames, saveOverrideNames, clearOverrideNames, loading };
}
