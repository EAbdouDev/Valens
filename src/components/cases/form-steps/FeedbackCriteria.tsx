"use client";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodSchema } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "@/components/cases/FormProvider";

export const feedbackCriteriaSchema = z.object({
  assessmentCriteria: z.string(),
});

type FeedbackCriteriaSchema = z.infer<typeof feedbackCriteriaSchema>;

interface FeedbackCriteriaProps {}

const FeedbackCriteria: FC<FeedbackCriteriaProps> = ({}) => {
  const { formValues, updateFormValues, currentStep, setCurrentStep } =
    useFormContext();

  const form = useForm<FeedbackCriteriaSchema>({
    resolver: zodResolver(feedbackCriteriaSchema),
    defaultValues: formValues as FeedbackCriteriaSchema,
  });

  const onNext = (values: FeedbackCriteriaSchema) => {
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
            <h1 className="text-2xl font-semibold">Feedback Criteria</h1>
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
            name="assessmentCriteria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assessment Criteria</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter assessment criteria"
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

export default FeedbackCriteria;
