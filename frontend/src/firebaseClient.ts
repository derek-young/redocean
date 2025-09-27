import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC94C9F5tAfwhdAWOlR3WIuG9xqSr2g0K0",
  authDomain: "redocean-e9f04.firebaseapp.com",
  projectId: "redocean-e9f04",
  storageBucket: "redocean-e9f04.firebasestorage.app",
  messagingSenderId: "989102844665",
  appId: "1:989102844665:web:88f20d632a8c2fb0fed028",
  measurementId: "G-VK8F5Y1QRJ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { analytics, app, auth };
