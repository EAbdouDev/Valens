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
import { useAuth } from "../auth/auth-provider";

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
  const auth = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    if (!auth?.currentUser) return;
    setIsCreating(true);
    const { slug } = await createNote(data, auth?.currentUser?.uid!);
    if (slug) {
      router.push(`/v/notes/${slug}`);
    }
    setIsCreating(false);
    setIsRedirecting(true);
    // onClose();
    // reset();
  };

  return (
    <>
      <div
        onClick={onOpen}
        className=" cursor-pointer w-full border-2 border-dashed rounded-2xl flex flex-col justify-center items-center gap-2  text-xl font-semibold p-4 hover:bg-gray-100 dark:hover:bg-muted  hover:border-divider transtion-all ease-soft-spring"
        // variant="ghost"
      >
        <Plus className="w-8 h-8" />
        New Note
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 !p-0">
                <img
                  src="/gbg.jpg"
                  alt=""
                  className="w-full h-auto rounded-t-lg"
                />
                <h1 className="m-4">Create New Note</h1>
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4 mb-2"
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

                  <Button
                    isDisabled={isCreating}
                    isLoading={isCreating}
                    type="submit"
                    color="primary"
                    className="font-semibold"
                  >
                    {isRedirecting ? "Redirecting..." : "Create"}
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default New;
