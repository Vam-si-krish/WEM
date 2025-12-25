import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID"
  apiKey: "AIzaSyD2o6exlfsfekxb_NY-GnF6dH_vUKiiSPE",
  authDomain: "west-end-market-4bb7c.firebaseapp.com",
  projectId: "west-end-market-4bb7c",
  storageBucket: "west-end-market-4bb7c.firebasestorage.app",
  messagingSenderId: "991926814916",
  appId: "1:991926814916:web:64f753e043a6990fd22191",
  measurementId: "G-HTKRXK4K0Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);