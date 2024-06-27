"use client";
import { getApps, initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";

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

if (currentApps.length <= 0) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  if (
    process.env.NEXT_PUBLIC_APP_ENV === "emulator" &&
    process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH
  ) {
    connectAuthEmulator(
      auth,
      `http://${process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH}`
    );
  }
} else {
  auth = getAuth(currentApps[0]);
}

export { auth };
