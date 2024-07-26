"use client";
import { getApps, initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from "firebase/firestore";
import {
  getStorage,
  connectStorageEmulator,
  FirebaseStorage,
} from "firebase/storage";

const currentApps = getApps();

const firebaseConfig = {
  apiKey: "AIzaSyBzrlqFZGoj6zs1OzCHcKTDMXH5lZEL_gU",
  authDomain: "valensai.firebaseapp.com",
  projectId: "valensai",
  storageBucket: "valensai.appspot.com",
  messagingSenderId: "1012612687585",
  appId: "1:1012612687585:web:263da1783efe68c7eff9a0",
  measurementId: "G-BMJ5KD2CCX",
};

let auth: Auth | undefined = undefined;
let storage: FirebaseStorage | undefined = undefined;
let firestore: Firestore | undefined = undefined;

if (currentApps.length <= 0) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
  firestore = getFirestore(app);

  if (
    process.env.NEXT_PUBLIC_APP_ENV === "emulator" &&
    process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH &&
    process.env.NEXT_PUBLIC_EMULATOR_STORAGE_PATH
  ) {
    connectAuthEmulator(
      auth,
      `http://${process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH}`
    );
    connectStorageEmulator(storage, "127.0.0.1", 9199);
    connectFirestoreEmulator(firestore, "127.0.0.1", 8081);
  }
} else {
  auth = getAuth(currentApps[0]);
  storage = getStorage(currentApps[0]);
  firestore = getFirestore(currentApps[0]);
}

export { auth, storage, firestore };
