"use client";
import "regenerator-runtime/runtime";
import React, { FC, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Mic, MicOff } from "lucide-react";
import useCaseSim from "@/zuztand/CaseSimState";

interface VoiceChatProps {}

const VoiceChat: FC<VoiceChatProps> = () => {
  const { setTextInput, isListening, setIsListening, textInput } = useCaseSim();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const prevTranscriptLength = useRef(0);

  useEffect(() => {
    if (!listening && transcript) {
      const newTranscriptPart = transcript.slice(prevTranscriptLength.current);
      setTextInput(textInput + " " + newTranscriptPart);
      prevTranscriptLength.current = transcript.length;
      resetTranscript(); // Clear the transcript after updating the input
    }
  }, [listening, transcript, setTextInput, textInput, resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleVoiceInput = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      resetTranscript();
      prevTranscriptLength.current = 0; // Reset the previous transcript length when starting a new session
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    }
  };

  return (
    <button
      className="p-3 border rounded-r-xl rounded-l-sm transition-all ease-in-out hover:opacity-80"
      onClick={handleVoiceInput}
    >
      {listening ? <MicOff /> : <Mic />}
    </button>
  );
};

export default VoiceChat;
