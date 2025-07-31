// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC6FRKrmRRmJ9i4c7y5Wbj7Fet45UerVfE",
  authDomain: "klip-mini.firebaseapp.com",
  projectId: "klip-mini",
  storageBucket: "klip-mini.firebasestorage.app",
  messagingSenderId: "551793027434",
  appId: "1:551793027434:web:20ed541150a40966099d13"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
