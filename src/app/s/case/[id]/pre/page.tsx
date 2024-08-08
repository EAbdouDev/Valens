import { getCaseDetails } from "@/components/cases/actions";
import { FC } from "react";
import Link from "next/link";

interface PageProps {
  params: {
    id: string;
  };
}

const CasePrePage: FC<PageProps> = async ({ params }) => {
  const caseDetailsDoc = await getCaseDetails(params.id);

  const caseDetails = caseDetailsDoc;

  if (!caseDetails) {
    return <div>Loading...</div>;
  }

  const {
    name,
    age,
    gender,
    occupation,
    image,
    pastMedicalHistory,
    familyMedicalHistory,
    surgicalHistory,
    allergies,
    socialHistory,
    chiefComplaint,
    historyOfPresentingIllness,
    vitalSigns,
    generalExamination,
  } = JSON.parse(
    //@ts-expect-error
    caseDetails.formData
  );

  return (
    <div className="p-8">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-5xl   p-6">
          <div className="flex flex-col md:flex-row items-center mb-6">
            <img
              src={image}
              alt={name}
              className="w-32 h-32 rounded-full shadow-lg mb-4 md:mb-0 md:mr-6"
            />
            <div>
              <h1 className="text-2xl font-semibold mb-2">{name}</h1>
              <p className="text-gray-600 dark:text-gray-300">{`${age} years old, ${gender}, ${occupation}`}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-2">Chief Complaint</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {chiefComplaint}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Past Medical History</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {pastMedicalHistory}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">
                Family Medical History
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {familyMedicalHistory}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Surgical History</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {surgicalHistory}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Allergies</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {allergies.join(", ")}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Social History</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {socialHistory}
              </p>
            </div>
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-lg font-medium mb-2">
                History of Presenting Illness
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {historyOfPresentingIllness}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">General Examination</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {generalExamination}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Vital Signs</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Temperature: {vitalSigns.temperatureC}°C /{" "}
                {vitalSigns.temperatureF}°F
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Pulse: {vitalSigns.pulse} bpm
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Blood Pressure: {vitalSigns.bloodPressure}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Respiratory Rate: {vitalSigns.respiratoryRate} breaths/min
              </p>
            </div>
          </div>
          <div className="my-6">
            <h1 className="text-2xl font-semibold mb-4">Instructions</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Please review the case details below. You will be interacting with
              a simulated patient based on this information. Pay close attention
              to the patient's history and presenting symptoms. Your task is to
              gather more information, consider possible diagnoses, and develop
              an appropriate treatment plan. Good luck!
            </p>
          </div>
          <div className="flex justify-center mt-10">
            <Link
              href={`/s/case/${params.id}`}
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md"
            >
              Start
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasePrePage;
