// src/app/change-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/firebaseAuth';
import {  updatePassword } from 'firebase/auth';
import style from '@/app/signup/signup.module.css'

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => { 
  //     if (!user || user.emailVerified === false) {
  //       router.push('/login');
  //     }

  //   })
  // }, []);

  const handleChangePassword = async () => {
    try {
        await updatePassword(auth.currentUser!, newPassword).then(() => {
          // Update successful.
        }).catch((error) => {
          console.log(error)
        });
        router.push('/home');
      
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center mt-20'>
    <div
      className='card bg-base-100 w-96 h-50 shadow-xl flex p-5'
      style={{background: '#fff9f9'}}
    >
      <h1 className={`${style.formh1}`}>Change Password</h1>
  
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
            type="text"
            className="grow"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>

        <br />

        <button className="btn glass text-xl" onClick={handleChangePassword}>Change</button>
  
        
      </div>
      </div>
  );
}
