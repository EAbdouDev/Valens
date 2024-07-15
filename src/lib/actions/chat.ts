"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type Chat } from "@/lib/types";
import { firestore } from "../../../firebase/server";

export async function getChats(userId?: string | null) {
  if (!userId) {
    return [];
  }

  try {
    const snapshot = await firestore!
      .collection(`users/${userId}/chats`)
      .orderBy("createdAt", "desc")
      .get();
    const chats = snapshot.docs.map((doc) => doc.data() as Chat);

    return chats;
  } catch (error) {
    return [];
  }
}

export async function getChat(id: string, userId: string = "anonymous") {
  try {
    const doc = await firestore!.doc(`users/${userId}/chats/${id}`).get();

    if (!doc.exists) {
      return null;
    }

    return doc.data() as Chat;
  } catch (error) {
    return null;
  }
}

export async function clearChats(
  userId: string = "anonymous"
): Promise<{ error?: string }> {
  try {
    const snapshot = await firestore!.collection(`users/${userId}/chats`).get();

    if (snapshot.empty) {
      return { error: "No chats to clear" };
    }

    const batch = firestore!.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    revalidatePath("/");
    redirect("/");
  } catch (error) {
    return { error: "error" };
  }
}

export async function saveChat(chat: Chat, userId: string = "anonymous") {
  try {
    await firestore!.doc(`users/${userId}/chats/${chat.id}`).set({
      ...chat,
      createdAt: Date.now(),
    });
  } catch (error) {
    console.error("Error saving chat:", error);
  }
}

export async function getSharedChat(id: string) {
  try {
    const snapshot = await firestore!
      .collectionGroup("chats")
      .where("id", "==", id)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const chat = snapshot.docs[0].data() as Chat;

    if (!chat.sharePath) {
      return null;
    }

    return chat;
  } catch (error) {
    return null;
  }
}

export async function shareChat(id: string, userId: string = "anonymous") {
  try {
    const docRef = firestore!.doc(`users/${userId}/chats/${id}`);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    const chat = doc.data() as Chat;

    if (chat.userId !== userId) {
      return null;
    }

    const payload = {
      ...chat,
      sharePath: `/share/${id}`,
    };

    await docRef.update(payload);

    return payload;
  } catch (error) {
    return null;
  }
}
