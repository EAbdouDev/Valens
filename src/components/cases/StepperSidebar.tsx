"use client";

import { FC } from "react";
import { useFormContext } from "./FormProvider";

interface StepperSidebarProps {}

const steps = [
  "Basic Patient Information",
  "Document Medical History",
  "Presenting Complaint",
  "Review of Systems",
  "Physical Examination Findings",
  "Diagnostic Tests",
  "Differential Diagnosis",
  "Final Diagnosis",
  "Treatment Plan",
  "Additional Notes",
  "Feedback Criteria",
  "Review and Submit",
];

const StepperSidebar: FC<StepperSidebarProps> = () => {
  const { currentStep, setCurrentStep, updateFormValues } = useFormContext();

  const handleStepClick = async (step: number) => {
    // Save current form values before switching steps
    const formValues = document.forms[0];
    const formData = new FormData(formValues);
    const values = Object.fromEntries(formData.entries());

    updateFormValues(values);
    setCurrentStep(step);
  };

  return (
    <div className="h-full w-full rounded-lg">
      <ul className="list-none rounded-lg w-full h-full p-4 space-y-4">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`py-2 px-4 cursor-pointer rounded-md ${
              currentStep === index + 1
                ? "bg-black text-white"
                : "opacity-50 hover:opacity-100"
            }`}
            onClick={() => handleStepClick(index + 1)}
          >
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StepperSidebar;
