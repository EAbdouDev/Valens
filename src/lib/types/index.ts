export type SearchResults = {
  images: string[];
  results: SearchResultItem[];
  query: string;
};

export type ExaSearchResults = {
  results: ExaSearchResultItem[];
};

export type SerperSearchResults = {
  searchParameters: {
    q: string;
    type: string;
    engine: string;
  };
  videos: SerperSearchResultItem[];
};

export type SearchResultItem = {
  title: string;
  url: string;
  content: string;
};

export type ExaSearchResultItem = {
  score: number;
  title: string;
  id: string;
  url: string;
  publishedDate: Date;
  author: string;
};

export type SerperSearchResultItem = {
  title: string;
  link: string;
  snippet: string;
  imageUrl: string;
  duration: string;
  source: string;
  channel: string;
  date: string;
  position: number;
};

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  messages: AIMessage[];
  sharePath?: string;
}

export type AIMessage = {
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
  content: string;
  id: string;
  name?: string;
  type?:
    | "answer"
    | "related"
    | "skip"
    | "inquiry"
    | "input"
    | "input_related"
    | "tool"
    | "followup"
    | "end";
};

export type Case = {
  title: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  formData: {
    name: string;
    age: number;
    gender: string;
    occupation: string;
    image: string;
    pastMedicalHistory: string;
    familyMedicalHistory: string;
    surgicalHistory: string;
    medications: string[];
    allergies: string[];
    socialHistory: string;
    chiefComplaint: string;
    historyOfPresentingIllness: string;
    cardiovascular: string;
    respiratory: string;
    gastrointestinal: string;
    genitourinary: string;
    musculoskeletal: string;
    neurological: string;
    hematological: string;
    endocrine: string;
    other: string;
    vitalSigns: {
      temperatureC: string;
      temperatureF: string;
      pulse: string;
      bloodPressure: string;
      respiratoryRate: string;
    };
    height: string;
    weight: string;
    generalExamination: string;
    labResults: any[];
    imagingStudies: any[];
    labResultsFindings: string;
    imagingStudiesFindings: string;
    differentialDiagnoses: any[];
    confirmedDiagnosis: string;
    reasonForFinalDiagnosis: string;
    nonPharmacologicalInterventions: string;
    followUpPlan: string;
    additionalObservations: string;
    assessmentCriteria: string;
  };
};
