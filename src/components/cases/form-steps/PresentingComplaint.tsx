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
import { presentingComplaintSchema } from "@/lib/schema/CaseForm";
import { Textarea } from "@/components/ui/textarea";

interface MedicalHistoryProps {}

const PresentingComplaint: FC<MedicalHistoryProps> = ({}) => {
  const { formValues, updateFormValues, currentStep, setCurrentStep } =
    useFormContext();

  const form = useForm<z.infer<typeof presentingComplaintSchema>>({
    resolver: zodResolver(presentingComplaintSchema),
    defaultValues: formValues,
  });

  const onNext = (values: z.infer<typeof presentingComplaintSchema>) => {
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
            <h1 className="text-2xl font-semibold">Presenting Complaint </h1>
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
          name="chiefComplaint"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Chief Complaint</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write the chief Complaint..."
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
          name="historyOfPresentingIllness"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>History Of Presenting Illness</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write the historyOfPresentingIllness..."
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
      </form>
    </Form>
  );
};

export default PresentingComplaint;
