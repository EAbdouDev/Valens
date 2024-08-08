"use client";
import useTextPod from "@/zuztand/TextEditorPod";
import { Button, Input } from "@nextui-org/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Crunker from "crunker";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useAuth } from "../auth/auth-provider";
import { generatePodcastScript } from "./actions";
import { firestore, storage } from "../../../firebase/client";
import { addDoc, collection } from "firebase/firestore";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const auth = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Untitled podcast");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCreatingAudio, setIsCreatingAudio] = useState(false);
  const [isConcate, setIsConcate] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const router = useRouter();
  const { text, setIsGenerating, setAiText, aiText, isGenerating } =
    useTextPod();

  useEffect(() => {
    setAiText("");
    setIsGenerating(false);
  }, []);

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

  const onSubmitName = (e: FormEvent) => {
    e.preventDefault();

    setIsEditing(false);
    router.push(`/v/podcasts/new?t=${title}`, { scroll: false });
    if (title === "") {
      setTitle("Untitled podcast");
    }
  };

  const upload = async (file: any): Promise<string | null> => {
    try {
      if (storage && auth?.currentUser) {
        const fileRef = ref(
          storage,
          `podcast/${auth.currentUser.uid}/${title}_${Date.now()}.mp3`
        );

        // Upload the file
        await uploadBytes(fileRef, file, {
          contentType: "audio/mp3",
        });

        // Get the download URL
        const downloadURL = await getDownloadURL(fileRef);
        return downloadURL;
      } else {
        throw new Error("Storage or current user is not initialized.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const onCreatePodcastScript = async () => {
    if (text === "") {
      toast.error("Can't generate an empty file!");
      return;
    }

    if (aiText !== "") {
      setAiText("");
    }
    setIsGenerating(true);

    const res = await generatePodcastScript(text);
    if (res) {
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
        body: JSON.stringify({
          podcastScript: aiText,
          title,
          userId: auth?.currentUser?.uid,
        }),
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
      const buffer = await output.blob.arrayBuffer();
      return buffer;
    } catch (error) {
      console.error(error);
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
      const buffer = await concateAudioFiles(result);
      setIsConcate(false);

      if (buffer) {
        setIsDone(true);
        const arrayBuffer = new Uint8Array(buffer).buffer;
        const base64String = Buffer.from(arrayBuffer).toString("base64");
        const file = Buffer.from(base64String, "base64");
        const url = await upload(file);

        if (url) {
          const podcastData = {
            title,
            url,
            script: aiText,
            createdBy: auth?.currentUser?.uid,
            createdAt: new Date(),
            isPublic: false, // Or set this based on your requirements
          };

          const data = await addDoc(
            collection(firestore!, "podcasts"),
            podcastData
          );

          const link = document.createElement("a");
          link.href = url;
          link.download = `${title}.mp3`;
          document.body.appendChild(link);
          // link.click();
          document.body.removeChild(link);
          router.push(`/v/podcasts/play/${data.id}`);

          setIsDone(false);
        }
      }
    } catch (error) {
      console.error("Error generating podcast audio:", error);
      toast.error("Failed to generate podcast audio");
    }
  };

  const isDisabled = isCreatingAudio || isConcate || isGenerating;

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

        <div className="flex justify-start items-center gap-4">
          <Button
            onClick={onCreatePodcastScript}
            className="flex justify-center items-center gap-2"
            variant="light"
            color="default"
            isDisabled={isDisabled}
          >
            <span className=" rounded-full border w-6 h-6 text-center flex justify-center">
              1
            </span>
            {aiText === "" ? "Generate the script" : "Regenrate"}
          </Button>
          <ArrowRight className="opacity-80" />
          <Button
            onClick={onCreatePodcastAudio}
            className="flex justify-center items-center gap-2"
            variant="light"
            color="default"
            isDisabled={aiText === "" || isDisabled}
          >
            <span className=" rounded-full border w-6 h-6 text-center flex justify-center">
              2
            </span>
            Generate the podcast Audio
          </Button>

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
