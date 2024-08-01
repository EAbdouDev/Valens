"use server";

import { firestore } from "../../../firebase/server";
import { Timestamp } from "firebase/firestore"; // Ensure you have this import if needed

export const getAllUserCases = async (userId: string) => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized.");
    }

    const casesSnapshot = await firestore
      .collection("cases")
      .where("createdBy", "==", userId)
      .orderBy("updatedAt", "desc")
      .get();

    if (casesSnapshot.empty) {
      return [];
    }

    const cases = casesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "", // Example field, adjust based on your schema
        createdBy: data.createdBy,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toMillis()
            : null,
        updatedAt:
          data.updatedAt instanceof Timestamp
            ? data.updatedAt.toMillis()
            : null,
        formData: {
          ...data.formData,
          medications: data.formData.medications || [],
          allergies: data.formData.allergies || [],
          labResults: data.formData.labResults || [],
          imagingStudies: data.formData.imagingStudies || [],
          differentialDiagnoses: data.formData.differentialDiagnoses || [],
        },
      };
    });

    return cases;
  } catch (e) {
    console.error("Error fetching cases: ", e);
    throw new Error("Error fetching cases");
  }
};

export const getCaseDetails = async (caseId: string) => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized.");
    }

    if (!caseId) return;

    const caseDoc = await firestore.collection("cases").doc(caseId).get();

    if (!caseDoc.exists) {
      return null;
    }

    return caseDoc.data();
  } catch (e) {
    console.error("Error fetching caseDetails: ", e);
    throw new Error("Error fetching caseDetails");
  }
};
