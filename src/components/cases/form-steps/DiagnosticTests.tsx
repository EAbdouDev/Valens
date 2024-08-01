"use client";
import { FC, useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { diagnosticTestsSchema } from "@/lib/schema/CaseForm";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "@/components/cases/FormProvider";
import UploadDialog from "../UploadDialog";
import { FileIcon, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase/client";
import { useAuth } from "@/components/auth/auth-provider";

interface DiagnosticTestsProps {}

const DiagnosticTests: FC<DiagnosticTestsProps> = ({}) => {
  const auth = useAuth();
  const { formValues, updateFormValues, currentStep, setCurrentStep } =
    useFormContext();

  const form = useForm<z.infer<typeof diagnosticTestsSchema>>({
    resolver: zodResolver(diagnosticTestsSchema),
    defaultValues: formValues,
  });

  const {
    fields: labResultsFields,
    append: appendLabResult,
    remove: removeLabResult,
  } = useFieldArray({
    control: form.control,
    name: "labResults",
  });

  const {
    fields: imagingStudiesFields,
    append: appendImagingStudy,
    remove: removeImagingStudy,
  } = useFieldArray({
    control: form.control,
    name: "imagingStudies",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState<
    "labResults" | "imagingStudies"
  >("labResults");

  const onNext = (values: z.infer<typeof diagnosticTestsSchema>) => {
    updateFormValues(values);
    setCurrentStep(currentStep + 1);
  };

  const onBack = () => {
    const values = form.getValues();
    updateFormValues(values);
    setCurrentStep(currentStep - 1);
  };

  const uploadFile = async (file: File, userId: string) => {
    const storageRef = ref(storage!, `cases/${userId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleUpload = async (label: string, file: File) => {
    if (auth && auth.currentUser) {
      const downloadURL = await uploadFile(file, auth.currentUser.uid);
      if (currentField === "labResults") {
        appendLabResult({ label, fileLink: downloadURL });
      } else {
        appendImagingStudy({ label, fileLink: downloadURL });
      }
    }
  };

  const openDialog = (field: "labResults" | "imagingStudies") => {
    setCurrentField(field);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">
          <div className="w-full flex justify-between items-center mb-12">
            <div>
              <h1 className="text-2xl font-semibold">Diagnostic Tests</h1>
            </div>
            <div className="flex justify-center items-center gap-4">
              <Button type="button" variant={"outline"} onClick={onBack}>
                Back
              </Button>
              <Button type="submit">Next</Button>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Lab Results</h2>

              <Button
                type="button"
                onClick={() => openDialog("labResults")}
                className="mt-4"
                variant={"outline"}
              >
                Upload Lab Result
              </Button>
            </div>
            <div className="my-4">
              <FormField
                control={form.control}
                name="labResultsFindings"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Lab Results Findings</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter lab results findings..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            {labResultsFields.length > 0 ? (
              <div className="my-4 space-y-2">
                {labResultsFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center gap-4">
                      <FileIcon className="w-8 h-8" />

                      <p className="flex-1">{field.label}</p>
                    </div>
                    <Button
                      type="button"
                      variant={"ghost"}
                      onClick={() => removeLabResult(index)}
                      size={"icon"}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="my-4 text-gray-500">No lab results uploaded yet.</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Imaging Studies</h2>
              <Button
                type="button"
                onClick={() => openDialog("imagingStudies")}
                className="mt-4"
                variant={"outline"}
              >
                Upload Imaging Study
              </Button>
            </div>
            <div className="my-4">
              <FormField
                control={form.control}
                name="imagingStudiesFindings"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Imaging Studies Findings</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter imaging studies findings..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            {imagingStudiesFields.length > 0 ? (
              <div className="my-4 space-y-2">
                {imagingStudiesFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center gap-4">
                      {field.fileLink && <FileIcon className="w-8 h-8" />}
                      <p className="flex-1">{field.label}</p>
                    </div>
                    <Button
                      type="button"
                      variant={"ghost"}
                      onClick={() => removeImagingStudy(index)}
                      size={"icon"}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="my-4 text-gray-500">
                No imaging studies uploaded yet.
              </p>
            )}
          </div>
        </form>
      </Form>
      <UploadDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUpload={handleUpload}
      />
    </>
  );
};

export default DiagnosticTests;
