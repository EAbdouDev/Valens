"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react";
import { Plus } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createNote } from "./actions";
import { useRouter } from "next/navigation";

interface NewProps {}

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
});

const New: FC<NewProps> = ({}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isCreating, setIsCreating] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setIsCreating(true);
    const { slug } = await createNote(data);
    if (slug) {
      router.push(`/v/notes/${slug}`);
    }
    setIsCreating(false);
    onClose();
    reset();
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="w-full border border-dashed flex flex-col justify-center items-center gap-2 h-[100px] text-xl font-semibold p-4"
        variant="ghost"
      >
        <Plus className="w-8 h-8" />
        New Note
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Note
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-8"
                >
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium "
                    >
                      Title
                    </label>
                    <Input
                      variant="bordered"
                      id="title"
                      type="text"
                      {...register("title")}
                      className="mt-1.5 block w-full  sm:text-sm"
                    />
                    {errors.title && (
                      <span className="text-red-500 text-sm">
                        {errors.title.message as string}
                      </span>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium "
                    >
                      Description
                    </label>
                    <Textarea
                      variant="bordered"
                      id="description"
                      {...register("description")}
                      className="mt-1.5 block w-full  sm:text-sm"
                    />
                  </div>
                  <Button
                    isDisabled={isCreating}
                    isLoading={isCreating}
                    type="submit"
                    color="primary"
                    className="font-semibold"
                  >
                    Create
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default New;
