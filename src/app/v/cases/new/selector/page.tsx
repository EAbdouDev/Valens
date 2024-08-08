"use client";

import Link from "next/link";
import { FC, useState } from "react";
import {
  RadioGroup,
  Radio,
  useRadio,
  VisuallyHidden,
  cn,
  RadioProps,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface pageProps {}

const SelectorPage: FC<pageProps> = ({}) => {
  const [selected, setSelected] = useState("custom-case");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleNext = () => {
    setIsLoading(true);
    router.push(`/v/cases/new/${selected}`);
  };
  return (
    <div className="p-8 w-full h-full mt-10">
      <header className="space-y-2 mb-8">
        <h1 className="text-2xl font-bold">Create New Case</h1>
        <p className="text-gray-500">
          Choose how you'd like to generate your case.
        </p>
      </header>

      {/* <div className="flex flex-col justify-center items-center  w-full  gap-6 mt-20">
        <Link href={"/v/cases/new/custom-case"}>Create Case from Scratch</Link>
        <Link href={"/v/cases/new/ai/disease-name"}>
          Generate Case by Disease Name
        </Link>
        <Link href={"/v/cases/new/ai/note-case"}>Generate Case from Note</Link>
      </div> */}

      <div className="flex flex-col justify-center items-center max-w-2xl mx-auto  gap-6 mt-10">
        <RadioGroup
          className="w-full"
          value={selected}
          onValueChange={setSelected}
        >
          <CustomRadio
            description="Start adding the case details from the scratch."
            value="custom-case"
          >
            Create Case from Scratch
          </CustomRadio>
          <CustomRadio
            className="opacity-50"
            description="Tell Gemini the disease name and let him create the case for you. "
            value="ai/disease-name"
          >
            AI: Generate Case by Disease Name
          </CustomRadio>
        </RadioGroup>

        {selected !== "" && (
          <div className="flex w-full justify-end items-end ">
            <Button
              variant="solid"
              color="primary"
              onPress={handleNext}
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectorPage;

const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    isSelected,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center justify-between hover:bg-content2 flex-row-reverse",
        "w-full cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
        "data-[selected=true]:border-primary"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">
            {description}
          </span>
        )}
      </div>
    </Component>
  );
};
