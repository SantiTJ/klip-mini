import { signInWithEmailAndPassword as firebaseSignIn, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const signInWithEmailAndPassword = (email: string, password: string) => {
  return firebaseSignIn(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export { auth };
