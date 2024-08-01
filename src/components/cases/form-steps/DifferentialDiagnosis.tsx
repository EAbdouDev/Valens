"use client";
import { FC } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { differentialDiagnosisSchema } from "@/lib/schema/CaseForm";
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
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface DifferentialDiagnosisProps {}

const DifferentialDiagnosis: FC<DifferentialDiagnosisProps> = ({}) => {
  const { formValues, updateFormValues, currentStep, setCurrentStep } =
    useFormContext();

  const form = useForm<z.infer<typeof differentialDiagnosisSchema>>({
    resolver: zodResolver(differentialDiagnosisSchema),
    defaultValues: formValues,
  });

  const {
    fields: differentialDiagnosesFields,
    append: appendDifferentialDiagnosis,
    remove: removeDifferentialDiagnosis,
  } = useFieldArray({
    control: form.control,
    name: "differentialDiagnoses",
  });

  const onNext = (values: z.infer<typeof differentialDiagnosisSchema>) => {
    updateFormValues(values);
    setCurrentStep(currentStep + 1);
  };

  const onBack = () => {
    const values = form.getValues();
    updateFormValues(values);
    setCurrentStep(currentStep - 1);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">
        <div className="w-full flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-semibold">Differential Diagnosis</h1>
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
            <h2 className="text-xl font-semibold">Possible Diagnoses</h2>
            <Button
              type="button"
              onClick={() =>
                appendDifferentialDiagnosis({
                  diagnosis: "",
                  reasonFor: "",
                  reasonAgainst: "",
                })
              }
              className="mt-4"
              variant={"outline"}
            >
              Add Diagnosis
            </Button>
          </div>
          {differentialDiagnosesFields.length > 0 ? (
            <div className="my-4 space-y-4 pb-10">
              {differentialDiagnosesFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col p-4 border rounded-md space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <FormField
                      control={form.control}
                      name={`differentialDiagnoses.${index}.diagnosis`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Diagnosis</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter diagnosis" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`differentialDiagnoses.${index}.reasonFor`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason For</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Reason for considering this diagnosis"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`differentialDiagnoses.${index}.reasonAgainst`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason Against</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Reason against considering this diagnosis"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div>
                    <Button
                      type="button"
                      variant={"outline"}
                      onClick={() => removeDifferentialDiagnosis(index)}
                      className=""
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="my-4 text-gray-500">
              No possible diagnoses added yet.
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};

export default DifferentialDiagnosis;
