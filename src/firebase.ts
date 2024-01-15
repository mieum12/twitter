// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA5ZXfyljeTiRqQbV-mNCtNonvx54VjrrE",
  authDomain: "twitter-eecab.firebaseapp.com",
  projectId: "twitter-eecab",
  storageBucket: "twitter-eecab.appspot.com",
  messagingSenderId: "670135068979",
  appId: "1:670135068979:web:1e2d58f100276c2ebc7646"
};

// config 옵션을 통해 app을 생성하고
const app = initializeApp(firebaseConfig);
// 그 app에 대한 인증 서비스를 사용하고싶다고 선언
export const auth = getAuth(app)

// 스토리지에 접근 가능
export const storage = getStorage(app)

// 데이터베이스에 접근 가능
export const db = getFirestore(app)