"use client";
import { FC, ReactNode, useEffect } from "react";
import {
  motion,
  HTMLMotionProps,
  useMotionValue,
  useTransform,
} from "framer-motion";

type Props = HTMLMotionProps<"div"> & {
  min?: number;
  max?: number;
  side?: "left" | "right";
  children: ReactNode;
};

const Panel: FC<Props> = ({
  children,
  style,
  min = 280,
  max = 420,
  side = "left",
  ...props
}) => {
  // A motion value for the handles x-axis offset
  const mvOffset = useMotionValue(0);

  // A motion value for the width of the panel, based on the offset value
  const mvWidth = useTransform(mvOffset, (v) =>
    side === "left" ? v + min : min - v
  );

  function startResizing() {
    // Set the global cursor
    document.body.style.cursor = "col-resize";
  }

  function stopResizing() {
    // Reset the cursor
    document.body.style.cursor = "default";

    // Save to local storage—be sure to save a clamped value!
    const offset = Math.max(0, Math.min(max - min, mvOffset.get()));
    localStorage.setItem(`${side}_sidebar_offset`, JSON.stringify({ offset }));
  }

  // On first mount, load a saved offset (if we have one)
  useEffect(() => {
    const saved = localStorage.getItem(`${side}_sidebar_offset`);
    if (saved !== null) {
      mvOffset.set(JSON.parse(saved).offset);
    }
  }, [side, mvOffset]);

  return (
    <motion.div
      className={`fixed p-4 top-0 h-full min-h-screen bg-gray-200 overflow-hidden ${
        side === "left" ? "left-0 border-r" : "right-0 border-l"
      }`}
      style={{ width: mvWidth, ...style }}
      {...props}
    >
      {children}
      <motion.div
        className={`fixed top-0 h-full w-1 cursor-col-resize bg-transparent transition-colors ${
          side === "left" ? `left-[${min - 3}px]` : `right-[${min - 3}px]`
        }`}
        style={{ x: mvOffset }}
        drag="x"
        dragElastic={0.025}
        dragConstraints={{
          left: side === "left" ? 0 : min - max,
          right: side === "left" ? max - min : 0,
        }}
        dragMomentum={false}
        variants={{
          active: {
            backgroundColor: "rgba(0,0,0,.2)",
          },
        }}
        whileTap="active"
        whileHover="active"
        onPointerDown={startResizing}
        onPointerUp={stopResizing}
        onPanEnd={stopResizing}
        onTap={stopResizing}
      />
    </motion.div>
  );
};

export default Panel;
