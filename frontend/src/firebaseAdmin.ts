import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function initializeFirebase() {
  if (getApps().length === 0) {
    return initializeApp();
  } else {
    return getApp();
  }
}

const app = initializeFirebase();
const auth = getAuth(app);

export { auth };
