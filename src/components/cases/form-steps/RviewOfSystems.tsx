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

const ReviewOfSystems: FC<MedicalHistoryProps> = ({}) => {
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
        <div className="w-full flex justify-between items-center mb-12">
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
                  placeholder="Describe any respiratory issues..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Detailed information helps in accurate diagnosis.
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
                  placeholder="Describe any cardiovascular issues..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Provide details to ensure comprehensive assessment.
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
                  placeholder="Describe any gastrointestinal issues..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Include any relevant symptoms or conditions.
              </FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endocrine"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Endocrine</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe any endocrine issues..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Include any relevant symptoms or conditions.
              </FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="genitourinary"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Genitourinary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe any genitourinary issues..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Include any relevant symptoms or conditions.
              </FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hematological"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Hematological</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe any hematological issues..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Include any relevant symptoms or conditions.
              </FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="musculoskeletal"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Musculoskeletal</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe any musculoskeletal issues..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Include any relevant symptoms or conditions.
              </FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="neurological"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Neurological</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe any neurological issues..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Include any relevant symptoms or conditions.
              </FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="other"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Other</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe any other issues..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Include any additional relevant information.
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

export default ReviewOfSystems;
