"use client";

import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { Save } from "lucide-react";
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

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const auth = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Untitled mindmap");
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
        if (title === "") {
          setTitle("Untitled mindmap");
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
      setTitle("Untitled map");
    }
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
          <Button>Save</Button>
        </div>
      </header>
    </>
  );
};

export default Header;
