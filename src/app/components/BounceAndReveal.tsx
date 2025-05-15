// components/BounceAndReveal.tsx
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

  // same blur & shadow filter as before…
  const stdDev = r * 0.45;

  return (
    <svg
      className="fixed inset-0 pointer-events-none"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter
          id="glow-filter"
          filterUnits="objectBoundingBox"
          x="-2"
          y="-2"
          width="5"
          height="5"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation={stdDev} result="BLUR" />
          <feFlood floodColor={fill} floodOpacity="1" result="COLOR" />
          <feComposite in="COLOR" in2="BLUR" operator="in" result="SHADOW" />
          <feMerge>
            <feMergeNode in="SHADOW" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* bounce + glow */}
      <AnimatePresence>
        {!showImage && (
          <motion.circle
            cx={cx}
            cy={cy}
            r={r}
            fill={fill}
            filter="url(#glow-filter)"
            animate={{ cy: [cy, cy - r * 1.5, cy] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => setShowImage(true)}
          />
        )}
      </AnimatePresence>

      {/* reveal + zoom */}
      <AnimatePresence>
        {showImage && (
          <motion.image
  href={kidSrc}
  x={cx - r}
  y={cy - r}
  width={r * 2}
  height={r * 2}
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 4}}

  transition={{
    opacity: { duration: 0.4, ease: "easeOut" },
    scale: {
      duration: 6,
      ease: "easeInOut",
      delay: 0.4,
    },
  }}
  exit={{ opacity: 0 }}
/>

        )}
      </AnimatePresence>
    </svg>
  );
}

