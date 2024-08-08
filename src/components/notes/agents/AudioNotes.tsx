"use client";
import { useAuth } from "@/components/auth/auth-provider";
import { generatePodcastScript } from "@/components/podcasts/actions";
import useNote from "@/zuztand/notesState";
import Crunker from "crunker";
import React, { FC, useState } from "react";
import { toast } from "sonner";
import { firestore, storage } from "../../../../firebase/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button, ScrollShadow } from "@nextui-org/react";
import { ArrowDown, ArrowRight, Sparkle } from "lucide-react";
import PodcastsLoader from "./PodcastsLoader";

interface AudioNotesProps {
  noteSlug: string;
}

const AudioNotes: FC<AudioNotesProps> = ({ noteSlug }) => {
  const auth = useAuth();
  const { text } = useNote();
  const [podcasts, setPodcasts] = useState<any>(null);
  const [aiText, setAiText] = useState<any>("");
  const [isCreatingAudio, setIsCreatingAudio] = useState(false);
  const [isConcate, setIsConcate] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<
    { speaker: string; text: string }[]
  >([]);
  const [title, setTitle] = useState<string>("Untitled podcast");
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);

  const onCreatePodcastScript = async () => {
    if (text === "") {
      toast.error("Can't generate an empty file!");
      return;
    }

    if (aiText !== "") {
      setAiText("");
    }
    setIsLoading(true);

    const res = await generatePodcastScript(text);
    if (res) {
      console.log(res);
      setAiText(res.podcastScript);
      setConversation(res.podcastScript);
      setTitle(res.title);
    }
    setIsLoading(false);
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

  const onCreatePodcastAudio = async () => {
    if (!aiText || aiText.length === 0) {
      toast.error("No podcast script available to generate audio!");
      return;
    }

    setShowLoader(true);

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
            noteSlug: noteSlug,
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
          setIsDone(false);
          setShowLoader(true);

          router.push(`/v/podcasts/play/${data.id}`);
        }
      }
    } catch (error) {
      console.error("Error generating podcast audio:", error);
      toast.error("Failed to generate podcast audio");
    }
  };

  const renderConversation = () => {
    if (!conversation) return null;

    return conversation.map((entry, index) => (
      <div
        key={index}
        className={`mb-2  ${
          entry.speaker === "aya"
            ? "bg-rose-50 dark:bg-transparent dark:border "
            : "bg-purple-50 dark:bg-transparent dark:border"
        } rounded-lg p-4 flex flex-col justify-start items-start gap-2`}
      >
        <p className=" opacity-80 font-bold">
          {entry.speaker.charAt(0).toUpperCase() + entry.speaker.slice(1)}
        </p>{" "}
        <p className="font-normal">
          {entry.text.replaceAll('<break time="1.0s" />', " ")}
        </p>
      </div>
    ));
  };

  const isDisabled = isCreatingAudio || isConcate || isLoading;

  return (
    <div className="flex flex-col ">
      <div className="flex flex-col justify-start items-center gap-4 ">
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
        <ArrowDown className="opacity-80 mx-auto" />
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

        {showLoader && (
          <PodcastsLoader
            isCreatingAudio={isCreatingAudio}
            isConcate={isConcate}
            isDone={isDone}
          />
        )}
      </div>

      {isLoading && (
        <div className="flex-1 h-full  px-6 py-8 w-full ">
          <div className="icon">
            <Sparkle className=" animate-spin duration-1000 transition-all ease-soft-spring mb-4 text-blue-500" />
          </div>
          <div className="loader_container space-y-2">
            <div className="loading-bar gradient-1 dark:gradient-1 animate-loading rounded-xl" />
            <div className="loading-bar gradient-2 dark:gradient-2 animate-loading rounded-xl" />
            <div className="loading-bar gradient-3 dark:gradient-3 animate-loading rounded-xl" />
          </div>

          <div className=" mt-10 text-center opacity-50 text-sm">
            <p>Gemini is working on the script...</p>
            <p>This usually takes 2 min or less.</p>
          </div>
        </div>
      )}
      <ScrollShadow hideScrollBar>
        {aiText && (
          <div className="flex-1   h-full w-full  ">
            <h1 className="text-2xl font-medium mb-6 ">Podcast script</h1>
            <div className="pb-10">{renderConversation()}</div>
          </div>
        )}
      </ScrollShadow>
    </div>
  );
};

export default AudioNotes;
