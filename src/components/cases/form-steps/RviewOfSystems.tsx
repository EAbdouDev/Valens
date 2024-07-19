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
import { reviewOfSystemsSchema } from "@/lib/schema/CaseForm";
import { Textarea } from "@/components/ui/textarea";

interface MedicalHistoryProps {}

const RviewOfSystems: FC<MedicalHistoryProps> = ({}) => {
  const { formValues, updateFormValues, currentStep, setCurrentStep } =
    useFormContext();

  const form = useForm<z.infer<typeof reviewOfSystemsSchema>>({
    resolver: zodResolver(reviewOfSystemsSchema),
    defaultValues: formValues,
  });

  const onNext = (values: z.infer<typeof reviewOfSystemsSchema>) => {
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
            <h1 className="text-2xl font-semibold">Review Of Systems</h1>
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
          name="respiratory"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Respiratory</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write the respiratory review..."
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
          name="cardiovascular"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Cardiovascular</FormLabel>
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
          name="gastrointestinal"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Gastrointestinal</FormLabel>
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
          name="endocrine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endocrine</FormLabel>
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
          name="genitourinary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genitourinary</FormLabel>
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
          name="hematological"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hematological</FormLabel>
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
        <FormField
          control={form.control}
          name="musculoskeletal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Musculoskeletal</FormLabel>
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
        <FormField
          control={form.control}
          name="neurological"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Neurological</FormLabel>
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
        <FormField
          control={form.control}
          name="other"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other</FormLabel>
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

export default RviewOfSystems;
