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
  const { currentStep } = useFormContext();

  return (
    <div className="h-full w-full rounded-lg mb-10">
      <ul className="list-none rounded-lg w-full h-full p-4 space-y-4">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`flex items-center py-2 px-4 rounded-md ${
              currentStep === index + 1 ? "bg-muted  " : "opacity-50"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full mr-4 ${
                currentStep === index + 1 ? "bg-black" : "bg-gray-400"
              }`}
            />
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StepperSidebar;
