"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { firestore } from "../../../firebase/server";
import { Timestamp } from "firebase/firestore";
import { generateObject, generateText } from "ai";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

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

    return { ...caseDoc.data(), id: caseDoc.id };
  } catch (e) {
    console.error("Error fetching caseDetails: ", e);
    throw new Error("Error fetching caseDetails");
  }
};

export const getCaseAnswer = async (ansId: string) => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized.");
    }

    if (!ansId) return;

    const caseDoc = await firestore.collection("cases_answer").doc(ansId).get();

    if (!caseDoc.exists) {
      return null;
    }

    return { ...caseDoc.data(), id: caseDoc.id };
  } catch (e) {
    console.error("Error fetching caseDetails: ", e);
    throw new Error("Error fetching caseDetails");
  }
};

export async function generateFeedback(answers: any, caseDetails: any) {
  const prompt = `
  You are an AI educator tasked with assessing a medical student's performance in a clinical case scenario. The student has interacted with a patient with the following case details:
  
  ${JSON.stringify(caseDetails, null, 2)}
  
  Your assessment should focus on three main areas: communication skills, diagnosis, and treatment plan. Please provide a mark out of 100 for the student's communication skills, detailed feedback on the diagnosis and treatment plan, and suggestions for improvement.
  
  Assessment Criteria:
  1. Communication Skills: Evaluate the student's ability to interact with the patient, ask relevant questions, listen actively, and show empathy. Be honest in your assessment and provide a score out of 100.
  2. Diagnosis: Assess the student's ability to gather relevant information, consider differential diagnoses, and identify the most likely diagnosis. Provide detailed feedback with examples highlighting strengths and areas for improvement.
  3. Treatment Plan: Review the student's proposed treatment plan, including medications, lifestyle advice, and follow-up care. Provide detailed feedback with examples highlighting strengths and areas for improvement.
  
  Provide the following:
  - An honest mark out of 100 for your communication skills.
  - Detailed feedback on your diagnosis, highlighting strengths and areas for improvement, with examples.
  - Detailed feedback on your treatment plan, highlighting strengths and areas for improvement, with examples.
  - Suggestions for how you can improve your overall approach to similar cases in the future, with examples.
  
  Here are your conversations with the patient: ${JSON.stringify(
    answers,
    null,
    2
  )}
  And here are the case details for context: ${JSON.stringify(
    caseDetails,
    null,
    2
  )}
  
  You are now providing feedback directly to the student. Please be thorough and honest in your feedback, ensuring it is constructive and includes specific examples to help the student understand how to improve.
  `;

  const { object } = await generateObject({
    model: google("models/gemini-1.5-pro-latest"),
    schema: z.object({
      communicationSkillsScore: z.number().min(0).max(100),
      diagnosisFeedback: z.string(),
      treatmentPlanFeedback: z.string(),
      suggestionsForImprovement: z.string(),
      communicationSkillsFeedback: z.string(),
    }),
    prompt: prompt,
  });

  return object;
}
