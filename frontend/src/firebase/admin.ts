import {
  cert,
  initializeApp,
  getApps,
  getApp,
  ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount: ServiceAccount = {
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

function initializeFirebase() {
  const options =
    process.env.NODE_ENV === "production"
      ? { credential: cert(serviceAccount) }
      : undefined;

  if (getApps().length === 0) {
    return initializeApp(options);
  } else {
    return getApp();
  }
}

const app = initializeFirebase();
const auth = getAuth(app);

export { auth };
