"use server";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { firestore } from "../../../firebase/server";
import { cookies } from "next/headers";

export const getFlashcards = async (userId: string) => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized.");
    }

    const flashcardsSnapshot = await firestore
      .collection("flashcards")
      .where("createdBy", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    if (flashcardsSnapshot.empty) {
      return [];
    }

    const flashcards = flashcardsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return flashcards;
  } catch (e) {
    console.error("Error fetching flashcards: ", e);
    throw new Error("Error fetching flashcards");
  }
};

export const getFlashcardsDetails = async (id: string) => {
  const _cookies = cookies();
  if (!id) return;
  try {
    const flashdoc = await firestore!.collection("flashcards").doc(id).get();

    if (!flashdoc.exists) {
      return null;
    }

    return { ...flashdoc.data(), id: flashdoc.id };
  } catch (e) {
    console.error("Error fetching flash details: ", e);
    throw new Error("Error fetching flash details");
  }
};
