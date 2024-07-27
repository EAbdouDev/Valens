"use client";

import { FC, useState } from "react";
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

import { useFormContext } from "@/components/cases/FormProvider";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicalHistorySchema } from "@/lib/schema/CaseForm";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface MedicalHistoryProps {}

const MedicalHistory: FC<MedicalHistoryProps> = ({}) => {
  const { formValues, updateFormValues, currentStep, setCurrentStep } =
    useFormContext();

  const form = useForm<z.infer<typeof medicalHistorySchema>>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: formValues,
  });

  const {
    fields: allergyFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control: form.control,
    //@ts-expect-error
    name: "allergies",
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

  const onNext = (values: z.infer<typeof medicalHistorySchema>) => {
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
        <div className="w-full flex justify-between items-center mb-12 ">
          <div>
            <h1 className="text-2xl font-semibold">Medical History</h1>
          </div>
          <div className="flex justify-center items-center gap-4">
            <Button type="button" variant={"outline"} onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </div>
        <FormField
          control={form.control}
          name="pastMedicalHistory"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Past Medical History</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write the past medical history..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Detailed past medical history helps in accurate diagnosis.
              </FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="familyMedicalHistory"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Family Medical History</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write the family history..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Family history can indicate genetic predispositions.
              </FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="socialHistory"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Social History</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write the social history..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Social habits such as smoking or drinking can affect health.
              </FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surgicalHistory"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Surgical History</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write the surgical history for the patient..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Previous surgeries can impact current health conditions.
              </FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="allergies"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Allergies</FormLabel>
              <div className="space-y-2">
                {allergyFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        placeholder="Write an allergy..."
                        {...form.register(`allergies.${index}`)}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeAllergy(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendAllergy("")}
                >
                  Add Allergy
                </Button>
              </div>
              <FormDescription>
                Knowing allergies is crucial for safe treatment.
              </FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medications"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Medications</FormLabel>
              <div className="space-y-2">
                {medicationFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        placeholder="Write a medication..."
                        {...form.register(`medications.${index}`)}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeMedication(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendMedication("")}
                >
                  Add Medication
                </Button>
              </div>
              <FormDescription>
                Current medications can interact with new treatments.
              </FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default MedicalHistory;
