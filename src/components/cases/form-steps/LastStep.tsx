"use client";
import { FC } from "react";
import { useFormContext } from "@/components/cases/FormProvider";
import { Button } from "@/components/ui/button";

interface ReviewAndSubmitProps {}

const LastStep: FC<ReviewAndSubmitProps> = ({}) => {
  const { formValues, currentStep, setCurrentStep } = useFormContext();

  const handleSubmit = () => {
    // Logic for submitting the final form
    console.log("Submitting form:", formValues);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderField = (label: string, value: string | undefined) => (
    <p>
      <strong>{label}:</strong> {value || "N/A"}
    </p>
  );

  const renderVitalSigns = (vitalSigns: any) => {
    if (!vitalSigns) return <p>N/A</p>;

    return (
      <div>
        {renderField("Temperature (C)", vitalSigns.temperatureC?.toString())}
        {renderField("Temperature (F)", vitalSigns.temperatureF?.toString())}
        {renderField("Pulse", vitalSigns.pulse?.toString())}
        {renderField("Blood Pressure", vitalSigns.bloodPressure)}
        {renderField(
          "Respiratory Rate",
          vitalSigns.respiratoryRate?.toString()
        )}
      </div>
    );
  };

  const renderImage = (label: string, image: string | undefined) => (
    <div>
      <strong>{label}:</strong>
      {image ? (
        <img
          src={image}
          alt={label}
          className="mt-2"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      ) : (
        <p>N/A</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Review and Submit</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Patient Information</h2>
        {renderField("Name", formValues.patientInformation?.name)}
        {renderField("Age", formValues.patientInformation?.age?.toString())}
        {renderField("Gender", formValues.patientInformation?.gender)}
        {renderField("Occupation", formValues.patientInformation?.occupation)}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Medical History</h2>
        {renderField(
          "Past Medical History",
          formValues.medicalHistory?.pastMedicalHistory
        )}
        {renderField(
          "Family Medical History",
          formValues.medicalHistory?.familyMedicalHistory
        )}
        {renderField(
          "Surgical History",
          formValues.medicalHistory?.surgicalHistory
        )}
        {renderField(
          "Medications",
          formValues.medicalHistory?.medications?.join(", ")
        )}
        {renderField(
          "Allergies",
          formValues.medicalHistory?.allergies?.join(", ")
        )}
        {renderField(
          "Social History",
          formValues.medicalHistory?.socialHistory
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Presenting Complaint</h2>
        {renderField(
          "Chief Complaint",
          formValues.presentingComplaint?.chiefComplaint
        )}
        {renderField(
          "History of Presenting Illness",
          formValues.presentingComplaint?.historyOfPresentingIllness
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Review of Systems</h2>
        {Object.entries(formValues.reviewOfSystems || {}).map(
          ([system, value]) =>
            //@ts-expect-error
            renderField(system.charAt(0).toUpperCase() + system.slice(1), value)
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Physical Examination Findings</h2>
        <div>
          <strong>Vital Signs:</strong>
          {renderVitalSigns(formValues.physicalExamination?.vitalSigns)}
        </div>
        {renderField(
          "General Examination",
          formValues.physicalExamination?.generalExamination
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Diagnostic Tests</h2>
        {renderField(
          "Lab Results Findings",
          formValues.diagnosticTests?.labResultsFindings
        )}
        {renderField(
          "Imaging Studies Findings",
          formValues.diagnosticTests?.imagingStudiesFindings
        )}
        {formValues.diagnosticTests?.labResults &&
          formValues.diagnosticTests.labResults.map(
            (labResult: any, index: any) =>
              renderImage(`Lab Result ${index + 1}`, labResult.fileLink)
          )}
        {formValues.diagnosticTests?.imagingStudies &&
          formValues.diagnosticTests.imagingStudies.map(
            (imagingStudy: any, index: any) =>
              renderImage(`Imaging Study ${index + 1}`, imagingStudy.fileLink)
          )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Differential Diagnosis</h2>
        {formValues.differentialDiagnosis?.differentialDiagnoses &&
          formValues.differentialDiagnosis.differentialDiagnoses.map(
            (diagnosis: any, index: any) => (
              <div key={index}>
                {renderField(`Diagnosis ${index + 1}`, diagnosis.diagnosis)}
                {renderField(`Reason For ${index + 1}`, diagnosis.reasonFor)}
                {renderField(
                  `Reason Against ${index + 1}`,
                  diagnosis.reasonAgainst
                )}
              </div>
            )
          )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Final Diagnosis</h2>
        {renderField(
          "Confirmed Diagnosis",
          formValues.finalDiagnosis?.confirmedDiagnosis
        )}
        {renderField(
          "Reason for Final Diagnosis",
          formValues.finalDiagnosis?.reasonForFinalDiagnosis
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Treatment Plan</h2>
        {renderField("Follow-Up Plan", formValues.treatmentPlan?.followUpPlan)}
        {formValues.treatmentPlan?.medications &&
          formValues.treatmentPlan.medications.map(
            (medication: any, index: any) =>
              renderField(`Medication ${index + 1}`, medication)
          )}
        {renderField(
          "Non-Pharmacological Interventions",
          formValues.treatmentPlan?.nonPharmacologicalInterventions
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Additional Notes</h2>
        {renderField(
          "Additional Observations",
          formValues.additionalNotes?.additionalObservations
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Feedback Criteria</h2>
        {renderField(
          "Assessment Criteria",
          formValues.feedbackCriteria?.assessmentCriteria
        )}
      </div>

      <div className="flex justify-between items-center">
        <Button type="button" variant={"outline"} onClick={handleBack}>
          Back
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default LastStep;
