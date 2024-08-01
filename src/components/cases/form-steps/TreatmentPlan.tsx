"use client";
import { FC, useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { treatmentPlanSchema } from "@/lib/schema/CaseForm";
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
import { Textarea } from "@/components/ui/textarea";

interface TreatmentPlanProps {}

const TreatmentPlan: FC<TreatmentPlanProps> = ({}) => {
  const { formValues, updateFormValues, currentStep, setCurrentStep } =
    useFormContext();

  const form = useForm<z.infer<typeof treatmentPlanSchema>>({
    resolver: zodResolver(treatmentPlanSchema),
    defaultValues: formValues,
  });

  const {
    fields: medicationFields,
    append: appendMedication,
    remove: removeMedication,
  } = useFieldArray({
    control: form.control,
    //@ts-expect-error
    name: "medications",
  });

  const onNext = (values: z.infer<typeof treatmentPlanSchema>) => {
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
            <h1 className="text-2xl font-semibold">Treatment Plan</h1>
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
            <h2 className="text-xl font-semibold">Medications</h2>
            <Button
              type="button"
              onClick={() => appendMedication("")}
              className="mt-4"
              variant={"outline"}
            >
              Add Medication
            </Button>
          </div>
          {medicationFields.length > 0 ? (
            <div className="my-4 space-y-2">
              {medicationFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col items-start justify-start gap-2 p-4 border rounded-md"
                >
                  <FormField
                    control={form.control}
                    name={`medicationsTreatment.${index}`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Medication</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter medication" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => removeMedication(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="my-4 text-gray-500">No medications added yet.</p>
          )}
        </div>
        <div>
          <FormField
            control={form.control}
            name="nonPharmacologicalInterventions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Non-Pharmacological Interventions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter non-pharmacological interventions"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="followUpPlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Follow-Up Plan</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter follow-up plan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default TreatmentPlan;
