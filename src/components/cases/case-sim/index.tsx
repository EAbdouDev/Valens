"use client";

import { FC, useState, useEffect } from "react";
import { useAnimation } from "framer-motion";
import { Howl } from "howler";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useCaseSim from "@/zuztand/CaseSimState";
import { useAuth } from "@/components/auth/auth-provider";
import { createAudio, generateResponse } from "./action";
import { Case } from "@/lib/types";
import Header from "./Header";
import ChatContainer from "./ChatContainer";
import Footer from "./Footer";

interface CaseSimProps {
  caseDetails: Case;
}

const CaseSim: FC<CaseSimProps> = ({ caseDetails }) => {
  const auth = useAuth();
  const { setTextInput } = useCaseSim();
  const [responses, setResponses] = useState<
    { role: string; response: string }[]
  >([]);
  const [userStarted, setUserStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const controls = useAnimation();

  const handleGenerateResponse = async (textInput: string) => {
    setUserStarted(true);
    setLoading(true);

    setResponses((prevResponses) => [
      ...prevResponses,
      { role: "you", response: textInput },
    ]);
    try {
      const jsonResponse = await generateResponse(textInput, caseDetails);
      console.log(jsonResponse);

      const res = jsonResponse.response.response;
      const role = jsonResponse.role;

      await createAudioStreamFromText(res, role);
      setResponses((prevResponses) => [
        ...prevResponses,
        { role, response: res },
      ]);
      controls.start({ opacity: 1 });
    } catch (error) {
      console.error("Error parsing JSON:", error);
    } finally {
      setLoading(false);
    }
  };

  const createAudioStreamFromText = async (text: string, role: string) => {
    const content = await createAudio(text, role, caseDetails);

    const prefix =
      role === "teacher" ? "Teacher:" : `${caseDetails.formData.name}:`;

    const audioBlob = new Blob([content], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const sound = new Howl({
      src: [audioUrl],
      format: ["mp3"],
      onload: () => {
        const duration = sound.duration();
        animateText(`${prefix} ${text}`, duration);
        sound.play();
      },
      onend: () => URL.revokeObjectURL(audioUrl),
    });
  };

  const animateText = (text: string, duration: number) => {
    const words = text.split(" ");
    const wordDuration = duration / words.length;
    let animatedText = "";

    words.forEach((word, index) => {
      setTimeout(() => {
        animatedText += ` ${word}`;
        setResponses((prevResponses) => {
          const lastResponse = prevResponses[prevResponses.length - 1];
          if (lastResponse && lastResponse.role === "animation") {
            lastResponse.response = animatedText;
            return [...prevResponses.slice(0, -1), lastResponse];
          }
          return [
            ...prevResponses,
            { role: "animation", response: animatedText },
          ];
        });
      }, index * wordDuration * 1000);
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const chatContainer = document.querySelector("#chat-container");
      if (!chatContainer) return;

      const chatMessages = Array.from(chatContainer.children);
      chatMessages.forEach((message, index) => {
        const messageElement = message as HTMLElement;
        const rect = messageElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const percentageInView = Math.min(
          Math.max((rect.bottom - rect.top) / windowHeight, 0),
          1
        );
        messageElement.style.opacity = percentageInView.toString();
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let timer: any;
    if (userStarted) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [userStarted]);

  const extractUrlAndRender = (message: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlMatch = message.match(urlRegex);
    const url = urlMatch ? urlMatch[0] : null;

    return (
      <span>
        {url ? (
          <img
            src={url}
            alt="Image from message"
            className="rounded-lg shadow"
          />
        ) : (
          message
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col h-screen">
      <Header caseTitle={caseDetails.title} elapsedTime={elapsedTime} />
      <div className="flex-1 flex flex-row overflow-y-hidden">
        <main className="flex-1 overflow-y-auto  m-2 rounded-xl">
          <div className="p-6 w-full h-full container max-w-3xl mx-auto">
            {!userStarted && (
              <div className="flex flex-col justify-center items-center w-full h-full flex-grow">
                <h1 className="text-3xl font-bold capitalize mb-3 bg-gradient-to-r from-blue-500 to-rose-500 bg-clip-text text-transparent">
                  Hey {auth?.currentUser?.displayName}, ready to start the
                  simulation?
                </h1>
                <p className="opacity-70 font-light text-lg">
                  Start talking to the patient, and the timer will start.
                </p>
              </div>
            )}
            <ChatContainer
              responses={responses}
              loading={loading}
              extractUrlAndRender={extractUrlAndRender}
              userStarted={userStarted}
              caseDetails={caseDetails}
            />
          </div>
        </main>
      </div>
      <Footer
        patientName={caseDetails.formData.name}
        onSubmit={handleGenerateResponse}
      />
    </div>
  );
};

export default CaseSim;
