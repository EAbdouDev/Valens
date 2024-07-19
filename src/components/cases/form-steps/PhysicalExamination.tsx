"use client";
import { FC } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { physicalExaminationSchema } from "@/lib/schema/CaseForm";
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
import { Textarea } from "@/components/ui/textarea";

interface PhysicalExaminationProps {}

const PhysicalExamination: FC<PhysicalExaminationProps> = ({}) => {
  const { formValues, updateFormValues, currentStep, setCurrentStep } =
    useFormContext();

  const form = useForm<z.infer<typeof physicalExaminationSchema>>({
    resolver: zodResolver(physicalExaminationSchema),
    defaultValues: formValues,
  });

  const onNext = (values: z.infer<typeof physicalExaminationSchema>) => {
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
            <h1 className="text-2xl font-semibold">Physical Examination</h1>
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
          name="vitalSigns.temperatureC"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Temperature (Celsius)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="36.6" {...field} />
              </FormControl>
              <FormDescription>Enter temperature in Celsius.</FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vitalSigns.temperatureF"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Temperature (Fahrenheit)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="97.9" {...field} />
              </FormControl>
              <FormDescription>
                Enter temperature in Fahrenheit.
              </FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vitalSigns.pulse"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Pulse</FormLabel>
              <FormControl>
                <Input type="number" placeholder="70" {...field} />
              </FormControl>
              <FormDescription>Enter the pulse rate.</FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vitalSigns.bloodPressure"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Blood Pressure</FormLabel>
              <FormControl>
                <Input placeholder="120/80" {...field} />
              </FormControl>
              <FormDescription>Enter the blood pressure.</FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vitalSigns.respiratoryRate"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Respiratory Rate</FormLabel>
              <FormControl>
                <Input type="number" placeholder="16" {...field} />
              </FormControl>
              <FormDescription>Enter the respiratory rate.</FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="height"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Height</FormLabel>
              <FormControl>
                <Input placeholder="180 cm" {...field} />
              </FormControl>
              <FormDescription>Enter the height.</FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Weight</FormLabel>
              <FormControl>
                <Input placeholder="75 kg" {...field} />
              </FormControl>
              <FormDescription>Enter the weight.</FormDescription>
              <FormMessage className="text-red-500 text-sm">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="generalExamination"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>General Examination</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="General appearance and condition"
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Enter the general examination findings.
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

export default PhysicalExamination;
