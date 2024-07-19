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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "@/components/cases/FormProvider";
import UploadDialog from "../UploadDialog";

interface DiagnosticTestsProps {}

const DiagnosticTests: FC<DiagnosticTestsProps> = ({}) => {
  const { formValues, updateFormValues, currentStep, setCurrentStep } =
    useFormContext();

  const form = useForm<z.infer<typeof diagnosticTestsSchema>>({
    resolver: zodResolver(diagnosticTestsSchema),
    defaultValues: formValues,
  });

  const { fields: labResultsFields, append: appendLabResult } = useFieldArray({
    control: form.control,
    //@ts-expect-error
    name: "labResults",
  });

  const { fields: imagingStudiesFields, append: appendImagingStudy } =
    useFieldArray({
      control: form.control,
      //@ts-expect-error
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

  const handleUpload = (label: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result as string;
      if (currentField === "labResults") {
        appendLabResult({ label, file: fileContent });
      } else {
        appendImagingStudy({ label, file: fileContent });
      }
    };
    reader.readAsDataURL(file);
  };

  const openDialog = (field: "labResults" | "imagingStudies") => {
    setCurrentField(field);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">
          <div className="w-full flex justify-between items-center mb-12 ">
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
            <div className="flex justify-between items-center ">
              <h2 className="text-xl font-semibold">Lab Results</h2>
              <Button
                type="button"
                onClick={() => openDialog("labResults")}
                className="mt-4"
              >
                Upload Lab Result
              </Button>
            </div>
            {labResultsFields.length > 0 && (
              <div className="flex flex-col justify-start items-start gap-4 flex-wrap w-full my-4 p-4 bg-gray-100 rounded-xl">
                {labResultsFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-4 flex flex-col justify-center items-center gap-4"
                  >
                    {/* @ts-expect-error */}
                    {field.file && (
                      <div className=" flex  justify-center items-center gap-2">
                        {/* @ts-expect-error */}

                        {field.file.startsWith("data:image") && (
                          <img
                            //@ts-expect-error
                            src={field.file}
                            //@ts-expect-error

                            alt={field.label}
                            className="w-20 h-20 rounded-md object-cover aspect-video"
                          />
                        )}
                        <p className="flex-1">
                          {/* @ts-expect-error */}
                          {field.label}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">Imaging Studies</h2>
            {imagingStudiesFields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                <FormField
                  control={form.control}
                  //@ts-expect-error
                  name={`imagingStudies.${index}.label`}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Label" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm">
                        {fieldState.error?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  //@ts-expect-error
                  name={`imagingStudies.${index}.file`}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          readOnly
                          placeholder="Uploaded file"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm">
                        {fieldState.error?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                {/* @ts-expect-error */}
                {field.file && (
                  <div>
                    {/* @ts-expect-error */}
                    {field.file.startsWith("data:image") && (
                      <img
                        //@ts-expect-error
                        src={field.file}
                        //@ts-expect-error
                        alt={field.label}
                        style={{ maxWidth: "100%" }}
                      />
                    )}
                    {/* @ts-expect-error */}
                    <p>{field.label}</p>
                  </div>
                )}
              </div>
            ))}
            <Button type="button" onClick={() => openDialog("imagingStudies")}>
              Upload Imaging Study
            </Button>
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
