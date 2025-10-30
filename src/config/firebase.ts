import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBnCJSNntVaOpyrYQcXCFmEZJYR5U4WJuI",
  authDomain: "culturecart-5c763.firebaseapp.com",
  projectId: "culturecart-5c763",
  storageBucket: "culturecart-5c763.firebasestorage.app",
  messagingSenderId: "582651532979",
  appId: "1:582651532979:web:2d1aa2b37e50235270c2c6",
  measurementId: "G-P1Z16E902H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
