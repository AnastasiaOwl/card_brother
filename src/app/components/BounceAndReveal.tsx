"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BounceAndRevealProps {
  cx: number;
  cy: number;
  r: number;
  fill: string;
}

export default function BounceAndReveal({
  cx,
  cy,
  r,
  fill,
}: BounceAndRevealProps) {
  const [showImage, setShowImage] = useState(false);
  const kidSrc = "/images/boy.png";

  return (
    <svg
      className="fixed inset-0 pointer-events-none"
      style={{ overflow: "visible" }}
    >
      <AnimatePresence>
        {!showImage && (
          <motion.circle
            cx={cx}
            cy={cy}
            r={r}
            fill={fill}
            animate={{ cy: [cy, cy - r * 1.5, cy] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => setShowImage(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showImage && (
          <motion.image
            href={kidSrc}
            x={cx - r}
            y={cy - r}
            width={r * 2}
            height={r * 2}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
    </svg>
  );
}
