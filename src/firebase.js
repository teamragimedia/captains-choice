import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🔥 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCU4rOQVR0vAIxY33854APaaEsZ2bX_wN8",
  authDomain: "ragimedia-b7f01.firebaseapp.com",
  projectId: "ragimedia-b7f01",
  storageBucket: "ragimedia-b7f01.firebasestorage.app",
  messagingSenderId: "602777831424",
  appId: "1:602777831424:web:19ed6dea18fff1b7c970e5",
  measurementId: "G-7HE9QRW8XP",
};

const app = initializeApp(firebaseConfig);

// ✅ Correct way (v9+)
export const auth = getAuth(app);
