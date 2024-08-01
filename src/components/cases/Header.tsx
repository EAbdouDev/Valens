"use client";

import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { Save, SaveIcon } from "lucide-react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/auth-provider";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../../../firebase/client";
import { useFormContext } from "./FormProvider";

interface HeaderProps {
  caseId: string | null;
}

const Header: FC<HeaderProps> = ({ caseId }) => {
  const auth = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Untitled case");
  const inputRef = useRef<HTMLInputElement>(null);
  const { formValues } = useFormContext();

  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
        if (title === "") {
          setTitle("Untitled case");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [title]);

  const onSubmitName = (e: FormEvent) => {
    e.preventDefault();

    setIsEditing(false);

    if (title === "") {
      setTitle("Untitled case");
    }
  };

  const saveCase = async () => {
    const caseData = {
      title,
      createdBy: auth?.currentUser!.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      formData: formValues,
    };
    if (caseId) {
      // Update existing case
      const caseRef = doc(firestore!, "cases", caseId);
      await setDoc(caseRef, caseData, { merge: true });
      return caseId;
    } else {
      // Create new case
      const casesCollection = collection(firestore!, "cases");
      const docRef = await addDoc(casesCollection, caseData);
      return docRef.id;
    }
  };

  const handleSave = async () => {
    await saveCase();

    alert("Case saved successfully");
  };

  return (
    <>
      <header className="h-[60px] w-full py-2 px-6 flex justify-between items-center border-b transition-all ease-soft-spring">
        <div className="w-[30%]">
          {!isEditing && (
            <button onClick={() => setIsEditing(true)}>{title}</button>
          )}

          {isEditing && (
            <form onSubmit={onSubmitName} className="w-full">
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 rounded-lg border w-full"
                autoFocus
              />
            </form>
          )}
        </div>

        <div>
          <Button
            onClick={handleSave}
            variant="solid"
            color="primary"
            className="flex justify-center items-center gap-2"
          >
            <SaveIcon className="w-5 h-5" /> Save
          </Button>
        </div>
      </header>
    </>
  );
};

export default Header;
