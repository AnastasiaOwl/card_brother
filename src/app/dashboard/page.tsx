"use client";

import { useState, useRef, useEffect} from "react";
import { motion } from "framer-motion";
import WelcomeSplash from "../components/WelcomeSplash";

export default function Dashboard() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [walkStarted, setWalkStarted] = useState(false);
  const [showStill,   setShowStill  ] = useState(false);
  const [removed,     setRemoved    ] = useState(false);
  const stepsAudioRef = useRef<HTMLAudioElement|null>(null);

    useEffect(() => {
    if (!walkStarted) return;
    stepsAudioRef.current?.play();
  }, [walkStarted]);

  useEffect(() => {
    if (!showStill) return;
    const audio = stepsAudioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [showStill]);

  function handleFirstTap() {
    setHasInteracted(true);
      const audio = new Audio("/sounds/footsteps.mp3");
    audio.preload = "auto";
    stepsAudioRef.current = audio;
    setTimeout(() => setWalkStarted(true), 6000);
    setTimeout(() => setRemoved(true), 17000);
  }


  if (!hasInteracted) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={handleFirstTap}
      >
        <p className="text-white text-2xl">тапни будь-де</p>
      </div>
    );
  }

if (removed) {
  return (
    <div className="h-screen bg-yellow-200 relative overflow-hidden">
      <motion.img
        src="/images/hug.png"
        alt="Boy and girl hugging"
        className="fixed top-[49%] left-[52%] -translate-x-1/2 -translate-y-1/2"
        style={{ width: 350, height: 350 }}
        transition={{ duration: 0.6, ease: "linear"}}
      />
    </div>
  );
}

  return (
    <div className="h-screen bg-yellow-200 relative overflow-hidden">
      <WelcomeSplash />

    {walkStarted && !showStill && !removed && (
      <motion.div 
      className="fixed top-[26%] left-[55%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999]"
          initial={{ x: "100vw" }}
          animate={{ x: 0 }}
          transition={{ duration: 8, ease: "linear" }}
          onAnimationComplete={() => {
            setShowStill(true);
          }}
        >
        <iframe
            src="/dragonbones/girlAnimation.html"
            width={200}
            height={300}
            style={{
              border:   "none",
              position: "absolute",
              top:      0,
              left:     0,
              zIndex:   1,
            }}
          />
      </motion.div>
    )}

     {showStill && !removed && (
      <motion.img
        key="still"
        src="/images/girl_standing.png"
        alt="Girl standing"
        style={{
          position: "absolute",
          top:      "26%",
          left:     "55%",
          width:200,
          height:300,
          zIndex:   2,
        }}
        transition={{ duration: 0, ease: "linear" }}
      />
    )}
    </div>
  );
}
