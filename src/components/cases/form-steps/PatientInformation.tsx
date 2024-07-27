"use client";
import { FC, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientInformationSchema } from "@/lib/schema/CaseForm";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "@/components/cases/FormProvider";

interface PatientInformationProps {}

const PatientInformation: FC<PatientInformationProps> = ({}) => {
  const { formValues, updateFormValues, currentStep, setCurrentStep } =
    useFormContext();

  const form = useForm<z.infer<typeof patientInformationSchema>>({
    resolver: zodResolver(patientInformationSchema),
    defaultValues: formValues,
  });

  const onNext = (values: z.infer<typeof patientInformationSchema>) => {
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
            <h1 className="text-2xl font-semibold">Patient Info</h1>
          </div>
          <div className="flex justify-center items-center gap-4">
            <Button type="submit">Continue</Button>
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>Write the patient name.</FormDescription>
                  <FormMessage className="text-red-500 text-sm">
                    {fieldState.error?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            {" "}
            <FormField
              control={form.control}
              name="age"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="45"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        field.onChange(isNaN(value) ? "" : value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Age can be a key factor in diagnosis.
                  </FormDescription>
                  <FormMessage className="text-red-500 text-sm">
                    {fieldState.error?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 flex-wrap">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="gender"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Gender can be a key factor in diagnosis.
                  </FormDescription>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    Some disease are occupational related.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PatientInformation;
