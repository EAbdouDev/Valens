import {initializeApp} from "firebase-admin/app";
import {firestore} from "firebase-admin";
import {auth, config} from "firebase-functions";

initializeApp(config().firebase);

export const onUserCreate = auth.user().onCreate(async (user) => {
  await firestore().doc(`users/${user.uid}`).create({
    id: user.uid,
    name: user.displayName,
    picture: user.photoURL,
    email: user.email,
  });
});
