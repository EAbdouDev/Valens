"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/lib/hooks/use-outside-click";
import { AudioLinesIcon, Loader2 } from "lucide-react";
import { useAuth } from "../auth/auth-provider";
import { getAllUserPodcasts } from "./actions";
import ReactAudioPlayer from "react-audio-player";

export function UserPodcastsList() {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const auth = useAuth();

  const showEmptyState = podcasts.length === 0 && !isLoading;

  useEffect(() => {
    const fetchPodcasts = async () => {
      setIsLoading(true);
      try {
        if (!auth?.currentUser) return;
        const fetchedPodcasts = await getAllUserPodcasts(auth.currentUser.uid);
        setPodcasts(fetchedPodcasts);
      } catch (e) {
        console.error("Failed to fetch podcasts:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, [auth?.currentUser]);

  const [active, setActive] = useState<
    (typeof podcasts)[number] | boolean | null
  >(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[600px] h-full md:h-auto md:max-h-[60%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-auto"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-6  ">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-medium text-neutral-700 dark:text-neutral-200 text-xl"
                    >
                      {active.title}
                    </motion.h3>
                  </div>

                  <div className="flex justify-center items-center gap-2">
                    <motion.a
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      href={`/p/play/${active.id}`}
                      target="_blank"
                      className="px-4 py-3 text-sm rounded-xl font-semibold border "
                    >
                      Edit
                    </motion.a>
                    <motion.button
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsPlaying(true)}
                      className="px-4 py-3 text-sm rounded-xl font-bold bg-black text-white"
                    >
                      Play
                    </motion.button>
                  </div>
                </div>
                {isPlaying && (
                  <div className="px-6 pb-4  w-full">
                    <ReactAudioPlayer src={active.url} controls />
                  </div>
                )}
                <div className="relative flex-1 overflow-hidden px-6 pb-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-full overflow-y-auto dark:text-neutral-400"
                    style={{ maxHeight: "100%" }}
                  >
                    {active.script.map((part: any, index: number) => (
                      <div key={index} className="mb-2">
                        <strong>{part.speaker}:</strong> {part.text}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      {podcasts.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
          {podcasts.map((card, index) => (
            <motion.div
              layoutId={`card-${card.title}-${id}`}
              key={card.title}
              onClick={() => setActive(card)}
              className="p-4 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer shadow-[rgba(99,99,99,0.2)_0px_2px_8px_0px] dark:shadow-none dark:border"
            >
              <div className="flex gap-4 flex-col w-full">
                <div className="flex justify-start items-start flex-col">
                  <AudioLinesIcon className="w-5 h-5 mb-2" />
                  <motion.h3
                    layoutId={`title-${card.title}-${id}`}
                    className="line-clamp-1 font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-sm mt-2">
                    {new Date(card.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </ul>
      )}

      {isLoading && (
        <div className="flex justify-center items-center flex-grow w-full h-full">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}
      {podcasts.length === 0 && !isLoading && <div>No podcasts yet.</div>}
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
