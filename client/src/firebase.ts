import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// This config is public. It identifies the project but grants no access on its own.
const firebaseConfig = {
  apiKey: "AIzaSyCkm-RehKxAgnRirUn_laABNHu-Ltiecrw",
  authDomain: "changeplusplus-31e06.firebaseapp.com",
  projectId: "changeplusplus-31e06",
  storageBucket: "changeplusplus-31e06.firebasestorage.app",
  messagingSenderId: "1037022604764",
  appId: "1:1037022604764:web:64b8298e02f0ddeb71b319",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
