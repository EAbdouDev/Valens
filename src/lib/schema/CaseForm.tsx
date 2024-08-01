import { z } from "zod";

// Define individual schemas for each part of the form

export const patientInformationSchema = z.object({
  name: z.string(),
  age: z.number(),
  gender: z.enum(["male", "female"]),
  occupation: z.string(),
  image: z.string().optional(),
});

export const medicalHistorySchema = z.object({
  pastMedicalHistory: z.string(),
  familyMedicalHistory: z.string(),
  surgicalHistory: z.string(),
  medications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  socialHistory: z.string().optional(),
});

export const presentingComplaintSchema = z.object({
  chiefComplaint: z.string(),
  historyOfPresentingIllness: z.string(),
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
      temperatureC: z.string().optional(),
      temperatureF: z.string().optional(),
      pulse: z.string().optional(),
      bloodPressure: z.string().optional(),
      respiratoryRate: z.string().optional(),
    })
    .optional(),
  height: z.string().optional(),
  weight: z.string().optional(),

  generalExamination: z.string().optional(),
});

export const diagnosticTestsSchema = z.object({
  labResults: z
    .array(
      z.object({
        label: z.string(),
        fileLink: z.string().optional(),
      })
    )
    .optional(),
  imagingStudies: z
    .array(
      z.object({
        label: z.string(),
        fileLink: z.string().optional(),
      })
    )
    .optional(),
  labResultsFindings: z.string().optional(),
  imagingStudiesFindings: z.string().optional(),
});

export const differentialDiagnosisSchema = z.object({
  differentialDiagnoses: z
    .array(
      z.object({
        diagnosis: z.string(),
        reasonFor: z.string().optional(),
        reasonAgainst: z.string().optional(),
      })
    )
    .optional(),
});

export const finalDiagnosisSchema = z.object({
  confirmedDiagnosis: z.string(),
  reasonForFinalDiagnosis: z.string(),
});

export const treatmentPlanSchema = z.object({
  medicationsTreatment: z.array(z.string()).optional(),
  nonPharmacologicalInterventions: z.string().optional(),
  followUpPlan: z.string(),
});

export const additionalNotesSchema = z.object({
  additionalObservations: z.string().optional(),
});

export const feedbackCriteriaSchema = z.object({
  assessmentCriteria: z.string(),
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
