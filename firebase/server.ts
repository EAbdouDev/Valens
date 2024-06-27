import {
  ServiceAccount,
  cert,
  getApps,
  initializeApp as adminInitializeApp,
} from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

const currentApps = getApps();
let firestore: Firestore | undefined = undefined;
let serviceAccountVar;

if (process.env.APP_URL === "http://localhost:3000") {
  serviceAccountVar = serviceAccountVar = require("./serviceAccount.json");
} else {
  serviceAccountVar = process.env.SERVICE_ACCOUNT;
}

if (currentApps.length === 0) {
  if (process.env.NEXT_PUBLIC_APP_ENV === "emulator") {
    process.env["FIRESTORE_EMULATOR_HOST"] =
      process.env.NEXT_PUBLIC_EMULATOR_FIRESTORE_PATH;
    process.env["FIRESTORE_AUTH_HOST"] =
      process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH;
  }

  const app = adminInitializeApp({
    credential: cert(serviceAccountVar as ServiceAccount),
  });

  firestore = getFirestore(app);
} else {
  firestore = getFirestore(currentApps[0]);
}

export { firestore };
