import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import config from "./config";

function initializeFirebase() {
  if (getApps().length === 0) {
    return initializeApp(config);
  } else {
    return getApp();
  }
}

const app = initializeFirebase();
const auth = getAuth(app);

export { auth };
