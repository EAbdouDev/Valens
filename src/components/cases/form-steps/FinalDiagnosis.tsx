"use client";
import { FC } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { finalDiagnosisSchema } from "@/lib/schema/CaseForm";
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

interface FinalDiagnosisProps {}

const FinalDiagnosis: FC<FinalDiagnosisProps> = ({}) => {
  const { formValues, updateFormValues, currentStep, setCurrentStep } =
    useFormContext();

  const form = useForm<z.infer<typeof finalDiagnosisSchema>>({
    resolver: zodResolver(finalDiagnosisSchema),
    defaultValues: formValues,
  });

  const onNext = (values: z.infer<typeof finalDiagnosisSchema>) => {
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
            <h1 className="text-2xl font-semibold">Final Diagnosis</h1>
          </div>
          <div className="flex justify-center items-center gap-4">
            <Button type="button" variant={"outline"} onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </div>
        <div>
          <FormField
            control={form.control}
            name="confirmedDiagnosis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmed Diagnosis</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the confirmed diagnosis"
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
            name="reasonForFinalDiagnosis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for Final Diagnosis</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the reason for the final diagnosis"
                    {...field}
                  />
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

export default FinalDiagnosis;
