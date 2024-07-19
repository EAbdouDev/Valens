import { z } from "zod";

// Define individual schemas for each part of the form

export const patientInformationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().int().min(0, "Age must be a positive integer"),
  gender: z.enum(["male", "female"]),
  occupation: z.string().optional(),
});

export const medicalHistorySchema = z.object({
  pastMedicalHistory: z.string().min(1, "Past medical history is required"),
  familyMedicalHistory: z.string().min(1, "Family medical history is required"),
  surgicalHistory: z.string().min(1).optional(),
  medications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  socialHistory: z.string().optional(),
});

export const presentingComplaintSchema = z.object({
  chiefComplaint: z.string().min(1, "Chief complaint is required"),
  historyOfPresentingIllness: z
    .string()
    .min(1, "History of presenting illness is required"),
});

export const reviewOfSystemsSchema = z.object({
  cardiovascular: z.string().default("N/A"),
  respiratory: z.string().default("N/A"),
  gastrointestinal: z.string().default("N/A"),
  genitourinary: z.string().default("N/A"),
  musculoskeletal: z.string().default("N/A"),
  neurological: z.string().default("N/A"),
  hematological: z.string().default("N/A"),
  endocrine: z.string().default("N/A"),
  other: z.string().default("N/A"),
});

export const physicalExaminationSchema = z.object({
  vitalSigns: z
    .object({
      temperatureC: z.number().optional(),
      temperatureF: z.number().optional(),
      pulse: z.number().optional(),
      bloodPressure: z.string().optional(),
      respiratoryRate: z.number().optional(),
    })
    .optional(),
  height: z.string().optional(),
  weight: z.string().optional(),

  generalExamination: z.string().optional(),
});

export const diagnosticTestsSchema = z.object({
  labResults: z.array(z.string()).optional(),
  imagingStudies: z.array(z.string()).optional(),
});

export const differentialDiagnosisSchema = z.object({
  possibleDiagnoses: z
    .array(z.string())
    .min(1, "At least one possible diagnosis is required"),
});

export const finalDiagnosisSchema = z.object({
  confirmedDiagnosis: z
    .string()
    .min(1, "Final confirmed diagnosis is required"),
});

export const treatmentPlanSchema = z.object({
  medications: z.array(z.string()).optional(),
  nonPharmacologicalInterventions: z.string().optional(),
  followUpPlan: z.string().min(1, "Follow-up plan is required"),
});

export const additionalNotesSchema = z.object({
  additionalObservations: z.string().optional(),
});

export const feedbackCriteriaSchema = z.object({
  assessmentCriteria: z.string().min(1, "Assessment criteria is required"),
});

// Combine individual schemas into the full case creation schema

export const caseCreationSchema = z.object({
  patientInformation: patientInformationSchema,
  medicalHistory: medicalHistorySchema,
  presentingComplaint: presentingComplaintSchema,
  reviewOfSystems: reviewOfSystemsSchema,
  physicalExamination: physicalExaminationSchema,
  diagnosticTests: diagnosticTestsSchema,
  differentialDiagnosis: differentialDiagnosisSchema,
  finalDiagnosis: finalDiagnosisSchema,
  treatmentPlan: treatmentPlanSchema,
  additionalNotes: additionalNotesSchema,
  feedbackCriteria: feedbackCriteriaSchema,
});
