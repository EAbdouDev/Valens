"use client";
import { FC } from "react";
import { motion } from "framer-motion";
import DayEventCard from "./DayEventCard";

interface DayEventsListProps {
  events: any[];
}

const DayEventsList: FC<DayEventsListProps> = ({ events }) => {
  const containerVariants = {
    hidden: { opacity: 1, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="flex flex-col justify-start items-start w-full gap-1 dark:bg-[#141414] p-4 rounded-xl "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {events.map((ev: any) => (
        <DayEventCard
          id={ev.id}
          attendees=""
          created={ev.created}
          creator={ev.creator}
          description={ev.description}
          end={ev.end}
          htmlLink={ev.htmlLink}
          start={ev.start}
          summary={ev.summary}
          updated={ev.updated}
          key={ev.id}
          animation={itemVariants}
        />
      ))}
    </motion.div>
  );
};

export default DayEventsList;
