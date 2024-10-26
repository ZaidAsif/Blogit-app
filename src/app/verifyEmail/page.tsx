'use client';

import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/firebaseAuth';
import { useEffect } from 'react';


export default function VerifyEmail() {
    const router = useRouter();

    useEffect(() => {
      onAuthStateChanged(auth, (user) => { 
        if (user?.emailVerified === true) {
          router.push('/home');
        }
  
      })
    }, [auth]);
    
    // const handleVerifyEmail = async () => {
    //   try {
    //     if (auth.currentUser) {
    //       await sendEmailVerification(auth.currentUser);
    //       alert('Verification email sent!');
    //     }
    //   } catch (error) {
    //     console.error('Error sending email:', error);
    //   }
    // }

    const handleVerifyEmail = () => {
        sendEmailVerification(auth.currentUser!);
    }

  return (
    <div className='flex flex-col justify-center items-center mt-20'>
    <div
      className='card bg-base-100 w-96 h-96 shadow-xl flex p-5'
      style={{background: '#fff9f9'}}
    >
      <h2>Hello user</h2>
      <p>Please! check your email inbox for the verification link.</p>
      <button
        style={{ color: 'brown', textDecoration: 'underline' }}
        onClick={handleVerifyEmail}
      >
        Click here! to get a new email if you haven’t yet
      </button>
      <br />
      <p>If you have verified your email. Reload this page</p>
    </div>
    </div>
  );
}
