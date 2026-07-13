import { useEffect, useState } from "react";
import { doc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { OverrideNames } from "@/types";
import { FIRESTORE_COLLECTIONS, FIRESTORE_DOCS } from "@/constants";

const DEFAULT_OVERRIDE_NAMES: OverrideNames = {
    teamANameOverride: "",
    teamBNameOverride: "",
};

export function useOverrideNames(courtId: string) {
    const [overrideNames, setOverrideNamesState] = useState<OverrideNames>(DEFAULT_OVERRIDE_NAMES);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!courtId) return;

        const ref = doc(
            db,
            FIRESTORE_COLLECTIONS.COURTS,
            courtId,
            FIRESTORE_DOCS.OVERRIDE_NAMES,
            FIRESTORE_DOCS.NAMES
        );

        const unsubscribe = onSnapshot(
            ref,
            (snap) => {
                if (snap.exists()) {
                    const data = snap.data();
                    setOverrideNamesState({
                        teamANameOverride: data.teamANameOverride || "",
                        teamBNameOverride: data.teamBNameOverride || "",
                    });
                } else {
                    setOverrideNamesState(DEFAULT_OVERRIDE_NAMES);
                }
                setError(null);
                setLoading(false);
            },
            (err) => {
                console.error("Realtime listener error:", err);
                setError("Chyba při načítání přepsaných jmen.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [courtId]);

    const saveOverrideNames = async (
        teamANameOverride: string,
        teamBNameOverride: string
    ): Promise<boolean> => {
        const ref = doc(
            db,
            FIRESTORE_COLLECTIONS.COURTS,
            courtId,
            FIRESTORE_DOCS.OVERRIDE_NAMES,
            FIRESTORE_DOCS.NAMES
        );
        try {
            await setDoc(ref, { teamANameOverride, teamBNameOverride });
            return true;
        } catch (err) {
            console.error("Chyba při ukládání přepsaných jmen:", err);
            return false;
        }
    };

    const clearOverrideNames = async (): Promise<boolean> => {
        const ref = doc(
            db,
            FIRESTORE_COLLECTIONS.COURTS,
            courtId,
            FIRESTORE_DOCS.OVERRIDE_NAMES,
            FIRESTORE_DOCS.NAMES
        );
        try {
            await deleteDoc(ref);
            setOverrideNamesState(DEFAULT_OVERRIDE_NAMES);
            return true;
        } catch (err) {
            console.error("Chyba při mazání přepsaných jmen:", err);
            return false;
        }
    };

    return { overrideNames, saveOverrideNames, clearOverrideNames, loading, error };
}
