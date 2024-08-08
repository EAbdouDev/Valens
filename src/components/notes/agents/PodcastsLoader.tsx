import { FC } from "react";
import { motion } from "framer-motion";

interface PodcastsLoaderProps {
  isCreatingAudio: boolean;
  isConcate: boolean;
  isDone: boolean;
}

const PodcastsLoader: FC<PodcastsLoaderProps> = ({
  isCreatingAudio,
  isConcate,
  isDone,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full bg-black/50 backdrop-blur z-50 flex flex-col justify-center items-center flex-grow text-white">
      <div className="flex flex-col items-start space-y-4">
        <StepItem
          isActive={isCreatingAudio}
          message="Generating audio..."
          delay={0.2}
        />
        <StepItem
          isActive={isConcate}
          message="Merging audio files..."
          delay={0.4}
        />
        <StepItem
          isActive={isDone}
          message="Finalizing and downloading..."
          delay={0.6}
        />
      </div>
    </div>
  );
};

interface StepItemProps {
  isActive: boolean;
  message: string;
  delay: number;
}

const StepItem: FC<StepItemProps> = ({ isActive, message, delay }) => {
  return (
    <motion.div
      className="flex items-center space-x-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        visibility: isActive ? "visible" : "hidden",
        opacity: isActive ? 1 : 0,
      }}
    >
      <div className="relative">
        <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
          {isActive && (
            <motion.div
              className="absolute w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      </div>
      <p className="text-lg font-medium">{message}</p>
    </motion.div>
  );
};

export default PodcastsLoader;
