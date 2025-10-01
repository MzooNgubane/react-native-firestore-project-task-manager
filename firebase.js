import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6meWfbiDsesh3Hf7VoUGeVPCdHEriVdE",
  authDomain: "gradedlab8.firebaseapp.com",
  projectId: "gradedlab8",
  storageBucket: "gradedlab8.appspot.com",
  messagingSenderId: "350070230029",
  appId: "1:350070230029:web:359c2fc0844f001dd65944"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };