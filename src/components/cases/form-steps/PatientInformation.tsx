"use client";
import { FC, useEffect, useState } from "react";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/components/auth/auth-provider";
import { storage } from "../../../../firebase/client";

interface PatientInformationProps {}

const PatientInformation: FC<PatientInformationProps> = ({}) => {
  const { formValues, updateFormValues, currentStep, setCurrentStep } =
    useFormContext();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const auth = useAuth();

  const form = useForm<z.infer<typeof patientInformationSchema>>({
    resolver: zodResolver(patientInformationSchema),
    defaultValues: formValues,
  });

  useEffect(() => {
    // Update the image preview state based on form values when the component mounts
    const imageUrl = formValues.image;
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
  }, [formValues.image]);

  const onNext = (values: z.infer<typeof patientInformationSchema>) => {
    updateFormValues(values);
    setCurrentStep(currentStep + 1);
  };

  const onBack = () => {
    const values = form.getValues();
    updateFormValues(values);
    setCurrentStep(currentStep - 1);
  };

  const uploadFile = async (file: File, userId: string) => {
    const storageRef = ref(storage!, `patient_images/${userId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const downloadURL = await uploadFile(file, auth!.currentUser!.uid);
      form.setValue("image", downloadURL);
      updateFormValues({ ...form.getValues(), image: downloadURL });
      setImagePreview(downloadURL);
    }
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

        <div className="flex justify-start items-start flex-col mb-8">
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <label htmlFor="image-upload">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 cursor-pointer flex justify-center items-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Upload Image</span>
              )}
            </div>
          </label>
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
                    <Input placeholder="Mohammed..." {...field} />
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
                    <Input placeholder="Teacher..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Some diseases are occupationally related.
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
