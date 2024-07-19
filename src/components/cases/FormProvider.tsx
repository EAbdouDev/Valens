"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FormContextType {
  formValues: any;
  updateFormValues: (values: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formValues, setFormValues] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormValues = (values: any) => {
    setFormValues((prevValues) => ({ ...prevValues, ...values }));
  };

  return (
    <FormContext.Provider
      value={{ formValues, updateFormValues, currentStep, setCurrentStep }}
    >
      {children}
    </FormContext.Provider>
  );
};
