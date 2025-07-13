import { useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../../firebaseConfig";

const db = getFirestore(app);

export function useAdminAuth(courtId: string) {
    const [isAuthed, setIsAuthed] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkPassword = async (enteredPassword: string) => {
        const ref = doc(db, "admin", courtId);
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
    }, [courtId]);

    return { isAuthed, checkPassword, loading };
}
