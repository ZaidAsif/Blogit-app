'use client';

import { app, db } from "@/app/firebase/firebase-config";
import { UserType } from "@/types/userType";
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, ReactNode, useEffect, useState } from "react";


type AuthContextType = {
    user: UserType | null,
    setUser: (user: UserType | null) => void
}


const AuthContext = createContext<AuthContextType | null>(null);



export default function AuthContextProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<UserType | null>(null);





    const auth = getAuth(app);

    useEffect(() => {

        onAuthStateChanged(auth, (loggedInUser) => {
            if (loggedInUser) {
                const uid = loggedInUser.uid
                fetchUserData(uid);
            } else {
                setUser(null);
            }
        })
    }, []);

    const fetchUserData = async (uid: string) => {
        const docRef = doc(db, 'users', uid);
        try {
            const userFound = await getDoc(docRef);
            const user = userFound.data();

            if (!user) return

            setUser(user as UserType);
        } catch (e) {
            console.log('error:', e);
        }
    }


    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);