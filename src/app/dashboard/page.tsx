"use client";

import { useState, useRef, useEffect} from "react";
import { motion, useAnimation } from "framer-motion";
import WelcomeSplash from "../components/WelcomeSplash";

export default function Dashboard() {
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [showStill,   setShowStill  ] = useState<boolean>(false);
  const [removed,     setRemoved    ] = useState<boolean>(false);
  const stepsAudioRef = useRef<HTMLAudioElement|null>(null);
  const walkControls = useAnimation();

    useEffect(() => {
    if (!hasInteracted) return;
    const audio = stepsAudioRef.current!;
    audio.preload = "auto";
    audio.load();

    audio.muted = true;
    audio.play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      })
      .catch(console.warn);
  }, [hasInteracted]);
  
  function handleFirstTap() {
    setHasInteracted(true);
    setTimeout(() => setRemoved(true), 17000);
  }

  const onZoomComplete = () => {
    walkControls.start({
      x: 0,
      transition: { duration: 8, ease: "linear" },
    });
  };

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
      <WelcomeSplash   onZoomComplete={onZoomComplete} />

    {hasInteracted && (
      <audio
        ref={stepsAudioRef}
        src="/sounds/footsteps.mp3"
        preload="auto"
        onCanPlayThrough={() => console.log("footsteps buffered")}
        onError={e => console.error("audio error", e)}
      />
    )}
      {!showStill && (
        <motion.div 
        className="fixed top-[26%] left-[55%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999]"
            initial={{ x: "100vw" }}
            animate={walkControls}
            onAnimationStart={() => {
              const delay = 3000;
              setTimeout(() => {
                const audio = stepsAudioRef.current!;
                audio.currentTime = 0;
                audio.playbackRate = 1.5;   
                audio.play().catch(console.error);
              }, delay);
            }}
            onAnimationComplete={() => {
              stepsAudioRef.current!.pause();
              stepsAudioRef.current!.currentTime = 0;
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
