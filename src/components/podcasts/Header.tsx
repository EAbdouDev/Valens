"use client";
import useTextPod from "@/zuztand/TextEditorPod";
import { Button, Input } from "@nextui-org/react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { generatePodcastScript } from "./actions";
import UploadPDF from "./UploadPDF";
import Crunker from "crunker";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Untitled podcast");
  const [res, setRes] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const { text, setIsGenerating, setAiText, aiText } = useTextPod();

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

  const onCreatePodcastScript = async () => {
    if (text === "") {
      toast.error("Can't generate an empty file!");
      return;
    }
    setIsGenerating(true);
    const res = await generatePodcastScript(text);
    if (res) {
      console.log(res);
      setAiText(res.podcastScript);
      setTitle(res.title);
    }

    setIsGenerating(false);
  };

  const onCreatePodcastAudio = async () => {
    if (!aiText || aiText.length === 0) {
      toast.error("No podcast script available to generate audio!");
      return;
    }

    // setIsGenerating(true);

    try {
      const response = await fetch("/api/podcast/generate-podcast-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ podcastScript: aiText }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate podcast audio");
      }

      const result = await response.json();
      console.log(result);

      // Use Crunker to concatenate the audio files
      const crunker = new Crunker();
      const audioBuffers = await crunker.fetchAudio(...result.audioUrls);
      const concatenated = crunker.concatAudio(audioBuffers);
      const output = crunker.export(concatenated, "audio/mp3");

      // Create a download link for the concatenated audio file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(output.blob);
      link.download = `${title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      router.push(
        `/v/podcasts/play?title=${title}&audioUrl=${encodeURIComponent(
          URL.createObjectURL(output.blob)
        )}`
      );
    } catch (error) {
      console.error("Error generating podcast audio:", error);
      toast.error("Failed to generate podcast audio");
    } finally {
      // setIsGenerating(false);
    }
  };

  return (
    <>
      <header className="h-[60px] w-full bg-gray-50 py-2 px-6 flex justify-between items-center border-b">
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

        <div className="flex justify-start items-center gap-4">
          <Button
            onClick={onCreatePodcastScript}
            className="flex justify-center items-center gap-2"
            variant="bordered"
            color="primary"
          >
            <Sparkles className="w-5 h-5" />
            Generate the script
          </Button>

          {aiText && (
            <Button
              onClick={onCreatePodcastAudio}
              className="flex justify-center items-center gap-2"
              variant="bordered"
              color="primary"
            >
              <Sparkles className="w-5 h-5" />
              Generate the podcast Audio
            </Button>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
