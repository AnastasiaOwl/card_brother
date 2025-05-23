"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

interface BounceAndRevealProps {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  onZoomComplete?: () => void; 
}

export default function BounceAndReveal({
  cx,
  cy,
  r,
  fill,
  onZoomComplete,
}: BounceAndRevealProps) {
  const [showImage, setShowImage] = useState(false);
  const controls = useAnimation();

  const popAudioRef = useRef<HTMLAudioElement>(
    typeof Audio !== "undefined" ? (() => {
     const audio = new Audio("/sounds/pop.mp3");
     audio.volume = 0.1;
     return audio;
   })() : null
  );
  
  const kidSrc = "/images/boy.png";
  const audioCtxRef    = useRef<AudioContext | null>(null);
  const audioBufRef    = useRef<AudioBuffer | null>(null);
  const srcNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    fetch("/sounds/typing.mp3")
      .then(res => res.arrayBuffer())
      .then(data => ctx.decodeAudioData(data))
      .then(buf => {
        audioBufRef.current = buf;
      });
    const unlock = () => {
      if (ctx.state === "suspended") ctx.resume();
    };
    window.addEventListener("click", unlock, { once: true });
    return () => window.removeEventListener("click", unlock);
  }, []);


  useEffect(() => {
    if (!showImage) return;

    (async () => {
      await controls.start(
        { opacity: 1 },
        { duration: 0.4, ease: "easeOut" }
      );
      const ctx = audioCtxRef.current!;
      const buf = audioBufRef.current!;
      if (ctx.state === "running" && buf) {
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start();
        src.stop(ctx.currentTime + 6);
        srcNodeRef.current = src; 
      }
     controls.start({ scale: 4 }, { duration: 6, ease: "easeInOut" });
    })();
  }, [showImage, controls]);

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
            onAnimationComplete={() => {
              const pop = popAudioRef.current!;
              pop.currentTime = 0;
              pop.play().catch(console.error);
              setShowImage(true);
            }}
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
             onAnimationStart={() => {
              onZoomComplete?.();
            }}
             onAnimationComplete={() => {
             srcNodeRef.current?.stop();
           }}
          />
        )}
      </AnimatePresence>
    </svg>
  );
}

