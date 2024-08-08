"use client";
import { FC, useEffect, useState, useRef } from "react";
import { getPodcastDetails } from "./actions";
import ReactAudioPlayer from "react-audio-player";

interface PlayCompProps {
  id: string;
}

interface Podcast {
  id: string;
  createdBy: string;
  createdAt: Date;
  noteSlug: string;
  script: Array<{ speaker: string; text: string }>;
  title: string;
  url: string;
}

const PlayComp: FC<PlayCompProps> = ({ id }) => {
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [overlayHeight, setOverlayHeight] = useState<number>(0);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const podcast = await getPodcastDetails(id);
      if (podcast) {
        const podcastObj = JSON.parse(podcast) as Podcast;
        setPodcast(podcastObj);
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  useEffect(() => {
    if (contentRef.current) {
      setOverlayHeight(contentRef.current.offsetHeight);
    }
  }, [podcast]);

  const renderConversation = () => {
    if (!podcast?.script) return null;

    return podcast.script.map((entry, index) => (
      <div
        key={index}
        className="rounded-lg flex flex-col justify-start items-start gap-2"
      >
        <p className="opacity-80 font-bold">
          {entry.speaker.charAt(0).toUpperCase() + entry.speaker.slice(1)}
        </p>
        <p className="font-normal mb-6">
          {entry.text.replaceAll('<break time="1.0s" />', " ")}
        </p>
      </div>
    ));
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="p-8 w-full container">
        <header className="relative mb-8 min-h-[600px] rounded-xl px-6 pb-8 flex flex-col justify-end items-start gap-4 bg-[url('/gbg.jpg')] bg-center bg-cover bg-no-repeat">
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl"
            style={{ height: `${overlayHeight + 100}px` }}
          ></div>
          <div className="relative z-10" ref={contentRef}>
            <h1 className="text-2xl 2xl:text-3xl font-bold text-white">
              {podcast?.title}
            </h1>
            <div className="flex justify-start items-center gap-4 text-white mt-4 text-sm">
              <p>Aug 5 2024</p>
              <p>@eslamabdou</p>
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-4xl mx-auto italic">
        <ReactAudioPlayer
          src={podcast?.url}
          controls
          className="w-full mb-16"
        />

        {renderConversation()}
        <p className="my-6">The End</p>
      </div>
    </div>
  );
};

export default PlayComp;
