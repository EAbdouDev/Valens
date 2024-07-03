import {
  ServiceAccount,
  cert,
  getApps,
  initializeApp as adminInitializeApp,
} from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import { Auth, getAuth } from "firebase-admin/auth";
import { Storage, getStorage } from "firebase-admin/storage";

const currentApps = getApps();
let firestore: Firestore | undefined = undefined;
let auth: Auth | undefined = undefined;
let storage: Storage | undefined = undefined;

const serviceAccountVar = {
  type: process.env.FIREBASE_TYPE!,
  project_id: process.env.FIREBASE_PROJECT_ID!,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID!,
  private_key: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL!,
  client_id: process.env.FIREBASE_CLIENT_ID!,
  auth_uri: process.env.FIREBASE_AUTH_URI!,
  token_uri: process.env.FIREBASE_TOKEN_URI!,
  auth_provider_x509_cert_url:
    process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL!,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL!,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN!,
};

if (currentApps.length === 0) {
  if (process.env.NEXT_PUBLIC_APP_ENV === "emulator") {
    process.env["FIRESTORE_EMULATOR_HOST"] =
      process.env.NEXT_PUBLIC_EMULATOR_FIRESTORE_PATH;
    process.env["FIREBASE_AUTH_EMULATOR_HOST"] =
      process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH;
    process.env["FIREBASE_STORAGE_EMULATOR_HOST"] =
      process.env.NEXT_PUBLIC_EMULATOR_STORAGE_PATH;
  }

  const app = adminInitializeApp({
    credential: cert(serviceAccountVar as ServiceAccount),
    storageBucket: "gs://valensai.appspot.com",
  });

  firestore = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
} else {
  firestore = getFirestore(currentApps[0]);
  auth = getAuth(currentApps[0]);
  storage = getStorage(currentApps[0]);
}

export { firestore, auth, storage };
