'use client';

import { app, db } from "@/app/firebase/firebase-config";
import { UserType } from "@/types/userType";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { createContext, useContext, ReactNode, useEffect, useState } from "react";


type AuthContextType = {
    user: UserType | null,
    setUser: (user: UserType | null) => void
}


const AuthContext = createContext<AuthContextType | null>(null);



export default function AuthContextProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<UserType | null>(null);





    const route = useRouter();
    const auth = getAuth(app);

    useEffect(() => {

        onAuthStateChanged(auth, (loggedInUser) => {
            if (loggedInUser) {
                let uid = loggedInUser.uid
                fetchUserData(uid);
            } else {
                setUser(null);
            }
        })
    }, []);

    const fetchUserData = async (uid: string) => {
        let docRef = doc(db, 'users', uid);
        try {
            let userFound = await getDoc(docRef);
            let user = userFound.data();

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