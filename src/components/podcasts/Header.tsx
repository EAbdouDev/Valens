"use client";
import useTextPod from "@/zuztand/TextEditorPod";
import { Button, Input } from "@nextui-org/react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { generatePodcastScript, saveConcatenatedAudioFile } from "./actions";
import UploadPDF from "./UploadPDF";
import Crunker from "crunker";
import { v4 as uuid } from "uuid";
import { storage } from "../../../firebase/server";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Untitled podcast");
  const [res, setRes] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCreatingAudio, setIsCreatingAudio] = useState(false);
  const [isConcate, setIsConcate] = useState(false);
  const [isDone, setIsDone] = useState(false);

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

  const createAudioFiles = async () => {
    setIsCreatingAudio(true);
    try {
      const response = await fetch("/api/podcast/generate-podcast-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ podcastScript: aiText, title }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate podcast audio");
      }

      const result = await response.json();

      return result;
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingAudio(false);
    }
  };

  async function concateAudioFiles(payload: any) {
    try {
      const crunker = new Crunker();
      const audioBuffers = await crunker.fetchAudio(...payload.audioUrls);
      const concatenated = crunker.concatAudio(audioBuffers);
      const output = crunker.export(concatenated, "audio/mp3");

      // Convert the Blob to Buffer
      const buffer = await output.blob.arrayBuffer();
      return buffer;
    } catch (error) {
      console.log(error);
    }
  }

  const onCreatePodcastAudio = async () => {
    if (!aiText || aiText.length === 0) {
      toast.error("No podcast script available to generate audio!");
      return;
    }

    try {
      const result = await createAudioFiles();

      setIsConcate(true);
      const buffer = await concateAudioFiles(result); // Ensure result is a plain object with necessary data
      setIsConcate(false);

      if (buffer) {
        setIsDone(true);
        const url = await saveConcatenatedAudioFile(title, buffer, result);

        if (url) {
          const link = document.createElement("a");
          link.href = url;
          link.download = `${title}.mp3`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          router.push(
            `/v/podcasts/play?title=${title}&audioUrl=${encodeURIComponent(
              url
            )}`
          );

          setIsDone(false);
        }
      }
    } catch (error) {
      console.error("Error generating podcast audio:", error);
      toast.error("Failed to generate podcast audio");
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

          {isCreatingAudio && <p>Generating Audio now...</p>}
          {isConcate && <p>Concatinating Audio Files now...</p>}
          {isDone && (
            <p>Almost done, file will be downloaded and redirecting soon... </p>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
