interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

let config: FirebaseConfig;

if (process.env.NODE_ENV === "production") {
  const projectId = process.env.FIREBASE_PROJECT_ID!;

  config = {
    apiKey: process.env.FIREBASE_API_KEY!,
    authDomain: `${projectId}.firebaseapp.com`,
    projectId: projectId,
    storageBucket: `${projectId}.firebasestorage.app`,
    messagingSenderId: "989102844665",
    appId: "1:989102844665:web:a25e950e99a120cafed028",
    measurementId: "G-DCVHHZMFV1",
  };
} else {
  const firebaseConfig = require("./firebaseConfig");
  config = firebaseConfig.default;
}

export default config;
