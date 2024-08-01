"use server";

import { nanoid } from "nanoid";
import slugify from "slugify";
import { firestore } from "../../../firebase/server";

interface Note {
  title: string;
  description?: string;
}

export const createNote = async (data: Note, userId: string) => {
  try {
    const slug =
      slugify(data.title, { lower: true, strict: true }) + "-" + nanoid(5);
    const docRef = await firestore!.collection("notes").add({
      ...data,
      slug,
      createdAt: new Date().toISOString(),
      createdBy: userId,
      isPublic: false,
    });
    return { id: docRef.id, slug };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Error adding document");
  }
};

export const getAllUserNotes = async (userId: string) => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized.");
    }

    const notesSnapshot = await firestore
      .collection("notes")
      .where("createdBy", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    if (notesSnapshot.empty) {
      return [];
    }

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

export const getPublicNotes = async () => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized.");
    }

    const notesSnapshot = await firestore
      .collection("notes")

      .where("isPublic", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    if (notesSnapshot.empty) {
      return [];
    }

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

export const getNoteCreator = async (userId: string) => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized.");
    }

    const userSnapshot = await firestore
      .collection("users")

      .where("id", "==", userId)
      .get();

    if (userSnapshot.empty) {
      return [];
    }

    const user = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return user;
  } catch (e) {
    console.error("Error fetching user: ", e);
    throw new Error("Error fetching user");
  }
};

export const updateTitle = async (noteId: string, newTitle: string) => {
  try {
    const noteRef = firestore!.collection("notes").doc(noteId);
    await noteRef.update({
      title: newTitle,
    });
    console.log(`Note with ID ${noteId} updated successfully.`);
  } catch (e) {
    console.error("Error updating note title: ", e);
    throw new Error("Error updating note title");
  }
};

export const getNoteDetails = async (noteSlug: string) => {
  if (!noteSlug) return;
  try {
    const notesSnapshot = await firestore!
      .collection("notes")
      .where("slug", "==", noteSlug)
      .limit(1)
      .get();

    if (notesSnapshot.empty) {
      throw new Error("No note found with the given slug");
    }

    const note = notesSnapshot.docs[0].data();
    return { id: notesSnapshot.docs[0].id, ...note };
  } catch (e) {
    console.error("Error fetching note details: ", e);
    throw new Error("Error fetching note details");
  }
};
