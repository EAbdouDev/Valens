"use client";

import { FC } from "react";
import { useFormContext } from "./FormProvider";
import PatientInformation from "./form-steps/PatientInformation";
import MedicalHistory from "./form-steps/MedicalHistory";
import PresentingComplaint from "./form-steps/PresentingComplaint";
import RviewOfSystems from "./form-steps/RviewOfSystems";
import PhysicalExamination from "./form-steps/PhysicalExamination";
import DiagnosticTests from "./form-steps/DiagnosticTests";
import DifferentialDiagnosis from "./form-steps/DifferentialDiagnosis";
import FinalDiagnosis from "./form-steps/FinalDiagnosis";
import TreatmentPlan from "./form-steps/TreatmentPlan";
import AdditionalNotes from "./form-steps/AdditionalNotes";
import FeedbackCriteria from "./form-steps/FeedbackCriteria";
import LastStep from "./form-steps/LastStep";

interface CaseFormProps {}

const CaseForm: FC<CaseFormProps> = ({}) => {
  const { currentStep, formValues } = useFormContext();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PatientInformation />;
      case 2:
        return <MedicalHistory />;
      case 3:
        return <PresentingComplaint />;
      case 4:
        return <RviewOfSystems />;
      case 5:
        return <PhysicalExamination />;
      case 6:
        return <DiagnosticTests />;
      case 7:
        return <DifferentialDiagnosis />;
      case 8:
        return <FinalDiagnosis />;
      case 9:
        return <TreatmentPlan />;
      case 10:
        return <AdditionalNotes />;
      case 11:
        return <FeedbackCriteria />;
      case 12:
        return <LastStep />;
      default:
        return <PatientInformation />;
    }
  };

  return (
    <div className="form-container w-full h-full mb-10">{renderStep()}</div>
  );
};

export default CaseForm;
