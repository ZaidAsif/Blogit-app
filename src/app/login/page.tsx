'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import style from './login.module.css'
import { auth } from "../firebase/firebaseAuth";


export default function Login() {

    const router = useRouter()

    // useEffect(() => {
    //     if(emailVerified === true) {
    //         router.push('/home');
    //     }
    // }, [currentUser, router, emailVerified])

    // const currentUser = auth.currentUser;





    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email!, password!)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user)
            router.push('/home')
            // return user
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage, errorCode);
    
        });
}
    

    
    return (

  <div className='flex flex-col justify-center items-center mt-20'>
  <div
    className='card bg-base-100 w-96 h-96 shadow-xl flex p-5'
    style={{background: '#fff9f9'}}
  >
    <h1 className={`${style.formh1}`}>Login</h1>

    <br />

      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path
            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
          <path
            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
        </svg>
        <input
          type="text"
          className="grow"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <br />


      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd" />
        </svg>
        <input 
          type="password" 
          className="grow" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          
        />
      </label>

      <br />

      <button className="btn glass text-xl" onClick={handleLogin}>
        Login
      </button>
      <br />
      <button
        style={{ color: '#2fb7a4', textDecoration: 'underline' }}
        onClick={() => router.push('/signup')}
      >
        Do not have an account! Signup here
      </button>
    </div>
    </div>
    )
}