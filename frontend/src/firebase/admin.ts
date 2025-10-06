import {
  cert,
  initializeApp,
  getApps,
  ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount: ServiceAccount = {
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

if (!getApps().length) {
  const options =
    process.env.NODE_ENV === "production"
      ? { credential: cert(serviceAccount) }
      : undefined;

  initializeApp(options);
}

const auth = getAuth();

export { auth };
