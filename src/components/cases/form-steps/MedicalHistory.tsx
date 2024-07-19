"use client";

import { FC } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicalHistorySchema } from "@/lib/schema/CaseForm";
import { Textarea } from "@/components/ui/textarea";

interface MedicalHistoryProps {}

const MedicalHistory: FC<MedicalHistoryProps> = ({}) => {
  const { formValues, updateFormValues, currentStep, setCurrentStep } =
    useFormContext();

  const form = useForm<z.infer<typeof medicalHistorySchema>>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: formValues,
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
                More details means accurate responses from Gemini
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
                Patients usually have genatic diseases
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
                Does this patient smoke, drinks?
              </FormDescription>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surgicalHistory"
          render={({ field }) => (
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
                Some disease are occupational related.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write the allergies if the patient have any..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Some disease are occupational related.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medications</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write the medications if the patient takes any..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Some disease are occupational related.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default MedicalHistory;
