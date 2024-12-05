// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY, // 환경 변수 사용
    authDomain: process.env.REACT_APP_AUTH_DOMAIN, // 환경 변수 사용
    projectId: process.env.REACT_APP_PROJECT_ID, // 환경 변수 사용
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET, // 환경 변수 사용
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID, // 환경 변수 사용
    appId: process.env.REACT_APP_APP_ID // 환경 변수 사용
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
