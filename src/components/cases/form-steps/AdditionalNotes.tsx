"use client";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { additionalNotesSchema } from "@/lib/schema/CaseForm";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "@/components/cases/FormProvider";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

type AdditionalNotesSchema = z.infer<typeof additionalNotesSchema>;

interface AdditionalNotesProps {}

const AdditionalNotes: FC<AdditionalNotesProps> = ({}) => {
  const { formValues, updateFormValues, currentStep, setCurrentStep } =
    useFormContext();

  const form = useForm<AdditionalNotesSchema>({
    resolver: zodResolver(additionalNotesSchema),
    defaultValues: formValues as AdditionalNotesSchema,
  });

  const onNext = (values: AdditionalNotesSchema) => {
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
            <h1 className="text-2xl font-semibold">Additional Notes</h1>
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
            name="additionalObservations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Observations</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional observations"
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

export default AdditionalNotes;
