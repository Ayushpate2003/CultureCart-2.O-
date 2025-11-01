import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBanhrAWXx2A4RokPLmmRqFZNxOp_o0J78",
  authDomain: "culture-2efe4.firebaseapp.com",
  projectId: "culture-2efe4",
  storageBucket: "culture-2efe4.firebasestorage.app",
  messagingSenderId: "922257143985",
  appId: "1:922257143985:web:f7685f693376c36495ca90",
  measurementId: "G-M953EFTBNV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional) - only in production
let analytics;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.log('Analytics not available:', error);
}
export { analytics };

// Configure auth persistence
auth.useDeviceLanguage();

export default app;
