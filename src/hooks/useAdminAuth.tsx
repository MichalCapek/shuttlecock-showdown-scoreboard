import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FIRESTORE_COLLECTIONS, FIRESTORE_DOCS } from "@/constants";

export function useAdminAuth(adminDocId: string) {
    const [isAuthed, setIsAuthed] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkPassword = async (enteredPassword: string) => {
        const ref = doc(db, FIRESTORE_COLLECTIONS.ADMIN, adminDocId);
        const snapshot = await getDoc(ref);
        const data = snapshot.data();
        if (!data || !data.password) return false;

        const isCorrect = data.password === enteredPassword;
        setIsAuthed(isCorrect);
        return isCorrect;
    };

    useEffect(() => {
        setIsAuthed(false);
        setLoading(false);
    }, [adminDocId]);

    return { isAuthed, checkPassword, loading };
}

export function useGlobalAdminAuth() {
    return useAdminAuth(FIRESTORE_DOCS.GLOBAL);
}
