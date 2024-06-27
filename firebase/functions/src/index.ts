import {initializeApp} from "firebase-admin/app";
import {firestore} from "firebase-admin";
import {auth, config} from "firebase-functions";
import {getAuth} from "firebase-admin/auth";

initializeApp(config().firebase);

export const onUserCreate = auth.user().onCreate(async (user) => {
  if (user.email && user.email === "eslamabdoudev@gmail.com") {
    await firestore().doc(`users/${user.uid}`).create({
      isAdmin: true,
    });

    const customClaims = {
      role: "admin",
    };

    try {
      await getAuth().setCustomUserClaims(user.uid, customClaims);
    } catch (error) {
      console.log(error);
    }
    return;
  }

  await firestore().doc(`users/${user.uid}`).create({
    isStudent: true,
  });
});
