'use client'

import { auth, db } from "@/app/firebase/firebase-config"
import { UserType } from "@/types/userType";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Navbar1() {
    const [user, setUser] = useState<UserType | undefined>(undefined);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                getDoc(userRef).then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data() as UserType;
                        setUser(userData);
                    }
                }).catch((error) => {
                    console.error('Error fetching user data:', error);
                });
            } else {
                setUser(undefined); 
            }
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
        setUser(undefined)
    }

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a>Homepage</a></li>
                        <li><a>Portfolio</a></li>
                        <li><a>About</a></li>
                    </ul>
                </div>
            </div> 
            <div className="navbar-center">
                <Link href={'/home'} className="text-4xl font-sans font-bold"><span className="text-red-500">Blog</span>it</Link>
            </div>
            <div className="navbar-end">
                { 
                    user ? (

                        <span className="flex">
                            {user.isAdmin && (
                                // <button className="btn btn-primary">
                                    <Link href="/dashboard"  className="btn btn-outline btn-error">Dashboard</Link>
                                // </button>
                            )}
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <img
                                            alt="User Avatar"
                                            src={user.profilePic || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                                        />
                                    </div>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                    <button onClick={() => router.push('/changeEmail')}>Change email</button>
                                    <button onClick={() => router.push('/changePassword')}>Change password</button>
                                    <button onClick={logout}>Logout</button>
                                </ul>
                            </div>
                        </span>

                    ) : (
                        <span>
                            <button className="btn btn-ghost">
                                <div className="indicator">
                                    <Link href={"/signup"}>Sign-up</Link>
                                </div>
                            </button>
                            <button className="btn btn-ghost">
                                <div className="indicator">
                                    <Link href={'/login'}>Login</Link>
                                </div>
                            </button>
                        </span>
                    )
                }
            </div>
        </div>
    );
}


