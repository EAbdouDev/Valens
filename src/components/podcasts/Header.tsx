"use client";
import useTextPod from "@/zuztand/TextEditorPod";
import { Button, Input } from "@nextui-org/react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { generatePodcastScript } from "./actions";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Untitled podcast");
  const [res, setRes] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const { text, setIsGenerating, setAiText } = useTextPod();

  const onSubmitName = (e: FormEvent) => {
    e.preventDefault();

    setIsEditing(false);
    router.push(`/v/podcasts/new?t=${title}`, { scroll: false });
    if (title === "") {
      setTitle("Untitled podcast");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
        if (title === "") {
          setTitle("Untitled podcast");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [title]);

  const onCreatePodcast = async () => {
    if (text === "") {
      toast.error("Can't generate an empty file!");
      return;
    }
    setIsGenerating(true);
    const res = await generatePodcastScript(text);
    if (res) {
      setAiText(res.podcastScript);
      setTitle(res.title);
    }

    setIsGenerating(false);
  };

  return (
    <>
      <header className="h-[60px] border w-full rounded-xl py-2 px-4 flex justify-between items-center ">
        <div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)}>{title}</button>
          )}

          {isEditing && (
            <form onSubmit={onSubmitName}>
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 rounded-lg border w-fit"
              />
            </form>
          )}
        </div>

        <div>
          <Button
            onClick={onCreatePodcast}
            className="flex justify-center items-center gap-2"
            variant="shadow"
            color="primary"
          >
            <Sparkles className="w-5 h-5" />
            Generate a podcast
          </Button>
        </div>
      </header>
    </>
  );
};

export default Header;
