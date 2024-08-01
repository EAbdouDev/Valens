import { FC } from "react";
import ChatBox from "./ChatBox";
import VoiceChat from "./VoiceChat";

interface FooterProps {
  patientName: string;
  onSubmit: (textInput: string) => void;
}

const Footer: FC<FooterProps> = ({ patientName, onSubmit }) => {
  return (
    <footer className="p-4">
      <div className="flex flex-col justify-center items-center gap-4 max-w-2xl mx-auto">
        <div className="w-full flex justify-center items-center gap-1">
          <div className="w-[90%]">
            <ChatBox patient_name={patientName} onSubmit={onSubmit} />
          </div>
          <div>
            <VoiceChat />
          </div>
        </div>
        <p className="text-xs font-light opacity-60 text-center">
          Valens can make mistakes. Development Still in early stages.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
