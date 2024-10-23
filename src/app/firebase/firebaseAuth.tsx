import { getAuth } from "firebase/auth";
import { app } from "./firebase-config";

export const auth = getAuth(app);

// const router = useRouter()
// export function signupWithEmailAndPassword(email: string, password: string) {
    
//     createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//         const user = userCredential.user;
//         console.log(user);
//         sendEmailVerification(user)
//     })
    
//     .catch((error) => {
//         const errorCode = error.errorCode;
//         const errorMessage = error.errorMessage;
//         console.log(errorMessage, errorCode);
//     })
// }

// export function loginWithEmailAndPassword(email: string, password: string) {
//     const router = useRouter()
//     signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//         const user = userCredential.user;
//         router.push('/home')
//         // return user
//     })
//     .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.error(errorMessage, errorCode);

//     });
// }