"use server";

import { nanoid } from "nanoid";
import slugify from "slugify";
import { firestore } from "../../../firebase/server";

interface Note {
  title: string;
  description?: string;
}

export const createNote = async (data: Note) => {
  try {
    const slug =
      slugify(data.title, { lower: true, strict: true }) + "-" + nanoid(5);
    const docRef = await firestore!.collection("notes").add({
      ...data,
      slug,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, slug };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Error adding document");
  }
};

export const getAllNotes = async () => {
  try {
    const notesSnapshot = await firestore!.collection("notes").get();
    const notes = notesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return notes;
  } catch (e) {
    console.error("Error fetching notes: ", e);
    throw new Error("Error fetching notes");
  }
};
