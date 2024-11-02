// src/app/change-email/page.tsx
'use client';

import {  useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/firebaseAuth';
import { onAuthStateChanged, sendEmailVerification, updateEmail } from 'firebase/auth';
import style from '@/app/signup/signup.module.css'
import { toast } from 'react-toastify';
export default function ChangeEmail() {
    const [newEmail, setNewEmail] = useState('');
    const router = useRouter();
  


    const handleChangeEmail = async () => {
        try {
          onAuthStateChanged(auth, async (loggedInUser) => {
            if (loggedInUser) {
              await updateEmail(loggedInUser, newEmail);
              await sendEmailVerification(loggedInUser);
              alert("Remember to verify your email after changing it! A verification email has been sent to your new E-mail")
               router.push('/home');
            } else {
                toast.error('user not found')
            }
          })

        } catch (error) {
            console.error('Error changing email:', error);
        }
    };



    return (
        <div className='flex flex-col justify-center items-center mt-20'>
    <div
      className='card bg-base-100 w-96 h-50 shadow-xl flex p-5'
      style={{background: '#fff9f9'}}
    >
      <h1 className={`${style.formh1}`}>Change Email</h1>
  
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
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </label>

        <br />

        <button className="btn glass text-xl" onClick={handleChangeEmail}>change email</button>
  
        
      </div>
      </div>
    );
}
