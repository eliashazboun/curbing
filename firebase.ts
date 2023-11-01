// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBdfmGixInfLTCRNgO6u35n1mrG64X-AjQ",
  authDomain: "curbing-711e9.firebaseapp.com",
  projectId: "curbing-711e9",
  storageBucket: "curbing-711e9.appspot.com",
  messagingSenderId: "1002173247500",
  appId: "1:1002173247500:web:6bd67efee33b507f2a3e29",
  measurementId: "G-REB9D9WMSK"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)