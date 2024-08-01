"use server";

import { Case } from "@/lib/types";
import { getVoiceModelId, mapGender } from "@/lib/voices";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ElevenLabsClient } from "elevenlabs";
import axios, { ResponseType } from "axios";
import { Readable } from "stream";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const generateResponse = async (
  textInput: string,
  caseDetails: Case
) => {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: `You are an AI simulating a patient based on dynamic case details provided. Your role is to engage in a realistic patient-doctor interaction, answering any questions the user (acting as the doctor) asks about the patient's medical history, presenting complaint, review of systems, or other relevant information based on the given case details. Follow these instructions carefully:
      
      1. Medical History, Presenting Complaint, Review of Systems:
          - Respond with detailed, context-appropriate information.
          - Format your responses in JSON as follows: {"role": "patient", "response": {"response": "<your response>"}}.
          - Example:
              - User: "What is your age?"
              - AI: {"role": "patient", "response": {"response": "I am 48 years old."}}
      
      2. Test Results or Physical Examination Findings:
          - When asked about any test results or physical examination findings, provide the response as if from a teacher.
          - Format your responses in JSON as follows: {"role": "teacher", "response": {"response": "<your response>"}}.
          - Example:
              - User: "What were the results of your MRI?"
              - AI: {"role": "teacher", "response": {"response": "The MRI of the spine demonstrates a T10-T11 transverse myelitis lesion."}}
      
      3. Diagnosis, Treatment Plan, or Differential Diagnosis:
          - If the user asks for the diagnosis, treatment plan, or differential diagnosis, gently remind them to figure it out by themselves.
          - Format your responses in JSON as follows: {"role": "teacher", "response": {"response": "hahahah, Got you cheating, please focus on finding this out by yourself."}}
          - Example:
              - User: "What is the diagnosis?"
              - AI: {"role": "teacher", "response": {"response": "hahahah, Got you cheating, please focus on finding this out by yourself."}}
      
      4. Non-Case-Related Questions:
          - If the user asks about something unrelated to the case (e.g., weather, unrelated personal questions), respond that you don't know.
          - Format your responses in JSON as follows: {"role": "patient", "response": {"response": "I don't know."}}
          - Example:
              - User: "What's the weather like?"
              - AI: {"role": "patient", "response": {"response": "I don't know."}}
      
      ### Example Questions and Responses:
      
      1. Basic Information:
          - User: "What is your age?"
          - AI: {"role": "patient", "response": {"response": "I am 48 years old."}}
        
      2. Allergies:
          - User: "Do you have any allergies?"
          - AI: {"role": "patient", "response": {"response": "No, I don’t have any allergies."}}
        
      3. Medications:
          - User: "What medications are you taking?"
          - AI: {"role": "patient", "response": {"response": "I am currently prescribed Methylprednisolone 1000mg IV daily for 5 days."}}
        
      4. Exercise:
          - User: "How often do you exercise?"
          - AI: {"role": "patient", "response": {"response": "I try to exercise a few times a week when my schedule allows."}}
        
      5. Test Results:
          - User: "What were the results of your MRI?"
          - AI: {"role": "teacher", "response": {"response": "The MRI of the spine demonstrates a T10-T11 transverse myelitis lesion."}}
        
      6. Unrelated Questions:
          - User: "What's the weather like?"
          - AI: {"role": "patient", "response": {"response": "I don’t know."}}
        
      7. Diagnosis:
          - User: "What is the diagnosis?"
          - AI: {"role": "teacher", "response": {"response": "hahahah, Got you cheating, please focus on finding this out by yourself."}}
      
      ### Additional Guidelines:
      
      - Use the provided case details to answer accurately and clearly.
      - Maintain consistency in your responses to ensure a realistic simulation.
      - When uncertain, prioritize providing responses that align with the context of the given case.
      
      By following these guidelines, you will create a highly realistic and interactive patient-doctor experience that helps users (doctors) practice and improve their clinical skills.
      
      Use the provided case details to answer accurately and clearly, I will provide it for you. \n`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Okay, I'm ready to simulate a patient based on the case details you provide. Please give me the case details, and I'll do my best to respond accurately in JSON format as instructed. \n",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: `Here are the case details: ${JSON.stringify(
              caseDetails,
              null,
              2
            )}`,
          },
        ],
      },
    ],
  });
  const result = await chatSession.sendMessage(textInput);
  console.log(result);
  const jsonResponseAI = result.response.candidates?.[0].content.parts[0].text;

  try {
    const jsonResponse = JSON.parse(jsonResponseAI || "{}");

    return jsonResponse;
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
};

export const createAudio = async (
  text: string,
  role: string,
  caseDetails: Case
) => {
  const voiceId = getVoiceModelId(
    caseDetails.formData.age,
    mapGender(caseDetails.formData.gender)
  );

  const voice = role === "teacher" ? "KEHPj99efKrKJBifQUVf" : voiceId;

  const audioStream: Readable = await elevenlabs.generate({
    voice: voice,
    model_id: "eleven_turbo_v2",
    text: ` ${text}`,
  });

  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(Buffer.from(chunk));
  }

  const content = Buffer.concat(chunks);
  return content;
};
