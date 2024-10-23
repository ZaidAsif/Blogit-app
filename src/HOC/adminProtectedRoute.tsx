import { auth, db } from "@/app/firebase/firebase-config";
import Loading from "@/components/loading";
import { UserType } from "@/types/userType";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminProtectedRoutes({children}: {children: ReactNode}) {
    const [user, setUser] = useState<UserType | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const route = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                getDoc(userRef).then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data() as UserType;
                        setUser(userData);
                        setIsLoading(false)
                    }
                }).catch((error) => {
                    console.error('Error fetching user data:', error);
                    route.push('/home');
                    setIsLoading(false);
                });
            } else {
                toast.error("User not authenticated");
                route.push('/home');
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, [route]);

    useEffect(() => {
        if (user && user?.isAdmin !== true) {
          toast.error("You are not an admin!");
          route.push("/");
        }
      }, [user, route]);

    return (
        <>
        {
            isLoading? <div className="flex justify-center"><Loading /></div> : children 
        }
        </>
    )
}