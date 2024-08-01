import { FC, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, Sparkle } from "lucide-react";

interface ChatContainerProps {
  responses: { role: string; response: string }[];
  loading: boolean;
  extractUrlAndRender: (message: string) => JSX.Element;
  userStarted: boolean;
  caseDetails: any; // Replace with actual type if available
}

const ChatContainer: FC<ChatContainerProps> = ({
  responses,
  loading,
  extractUrlAndRender,
  userStarted,
  caseDetails,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [responses]);
  return (
    <div
      id="chat-container"
      className="flex flex-col w-full h-full overflow-y-auto gap-2 pb-10"
    >
      <AnimatePresence>
        {userStarted &&
          responses.map((response, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-3 px-2 rounded-xl"
            >
              <p className="flex flex-col gap-2">
                <div className="flex justify-start items-center gap-2">
                  {response.role === "patient" && (
                    <img
                      src={caseDetails.formData.image}
                      alt="patientpic"
                      className="w-8 h-8 object-cover rounded-full border"
                    />
                  )}
                  <span className="capitalize font-semibold opacity-50 mr-4">
                    {response.role === "animation" ? "" : `${response.role} `}
                  </span>
                </div>
                <span className="font-light">
                  {extractUrlAndRender(response.response)}
                </span>
              </p>
            </motion.div>
          ))}
        {loading && (
          <div className="flex-1 h-full   w-full ">
            {/* <div className="icon">
              <Sparkle className=" animate-spin duration-1000 transition-all ease-soft-spring mb-4 text-blue-500" />
            </div> */}
            <div className="loader_container space-y-2">
              <div className="loading-bar gradient-1 dark:gradient-1 animate-loading rounded-xl" />
              <div className="loading-bar gradient-2 dark:gradient-2 animate-loading rounded-xl" />
              <div className="loading-bar gradient-3 dark:gradient-3 animate-loading rounded-xl" />
            </div>
          </div>
        )}
      </AnimatePresence>

      {responses.length > 0 && <div ref={bottomRef} className="my-4" />}
    </div>
  );
};

export default ChatContainer;
