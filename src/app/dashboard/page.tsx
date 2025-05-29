"use client";

import { useState, useRef, useEffect} from "react";
import { motion, useAnimation } from "framer-motion";
import WelcomeSplash from "../components/WelcomeSplash";
import dynamic from 'next/dynamic';

const HandwritingSVG = dynamic(
  () => import('../components/HandwritingSVG'),
  { ssr: false }
);

export default function Dashboard() {
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [showStill,   setShowStill  ] = useState<boolean>(false);
  const [removed,     setRemoved    ] = useState<boolean>(false);
  const stepsAudioRef = useRef<HTMLAudioElement|null>(null);
  const walkControls = useAnimation();
  const introRef = useRef<HTMLAudioElement | null>(null);
  const squeezeRef  = useRef<HTMLAudioElement>(
    typeof Audio !== "undefined" ? (() => {
     const audio = new Audio("/sounds/squeeze.mp3");
     return audio;
   })() : null
  );
  const finalRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio("/sounds/intro.mp3");
    a.preload = "auto";
    a.load();
    introRef.current = a;
  }, []);

useEffect(() => {
  const finalAudio = new Audio("/sounds/final.mp3");
  finalAudio.preload = "auto";
  finalAudio.load();
  finalRef.current = finalAudio;
}, []);

  useEffect(() => {
  if (!removed) return;
  const squeeze = squeezeRef.current!;
  squeeze.currentTime = 0;
  squeeze.play().catch(console.error);
  }, [removed]);

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

useEffect(() => {
  if (!removed) return;
  const timer = setTimeout(() => {
    const finalAudio = finalRef.current;
    if (finalAudio) {
      finalAudio.currentTime = 0;
      finalAudio.play().catch(console.error);
    }
  }, 1500);
  return () => clearTimeout(timer);
}, [removed]);


  
  function handleFirstTap() {
    setHasInteracted(true);
    setTimeout(() => setRemoved(true), 14500);
  }

  const onZoomComplete = () => {
    walkControls.start({
      x: 0,
      transition: { duration: 8, ease: "linear" },
    });
  };

if (removed) {
  return (
     <div className="w-screen h-[100dvh] flex flex-col items-center justify-center lg:space-y-40 md:space-y-20 bg-yellow-200">
      <HandwritingSVG
        text="Найкращому брату, дякую що ти завжди поряд"
        fontUrl="/fonts/Handwriting.ttf"
        fontSize={50}
      />
      <motion.img
        src="/images/hug.png"
        alt="Boy and girl hugging"
        className="fixed top-[49%] left-[52%] lg:w-[350px] lg:h-[350px] md:w-[180px] md:h-[180px] -translate-x-1/2 -translate-y-1/2"
        initial={{ top: "49%" }}         
        animate={{ top: "75%" }}         
        transition={{
          delay: 0.9,                    
          duration: 0.95,                 
          ease: "linear"
        }}
      />
    </div>
  );
}

  return (
    <div className="h-[100dvh]  bg-yellow-200 relative overflow-hidden">

    {hasInteracted && (
        <WelcomeSplash
          introAudio={introRef}
          onZoomComplete={onZoomComplete}
        />
    )}
    {hasInteracted && (
      <audio
        ref={stepsAudioRef}
        src="/sounds/footsteps.mp3"
        preload="auto"
        onCanPlayThrough={() => console.log("footsteps buffered")}
        onError={e => console.error("audio error", e)}
      />
    )}
     {!hasInteracted && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={handleFirstTap}
      >
        <p className="text-white text-2xl">тапни будь-де</p>
      </div>
    )}
      {!showStill && (
        <motion.div 
        className="fixed lg:top-[26%] left-[55%] md:top-[23%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999]"
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
              className="lg:w-[200px] lg:h-[300px] md:w-[100px] md:h-[148px]"
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
       className="
          absolute
          lg:top-[26%] md:top-[23%] left-[55%] 
          lg:w-[200px] lg:h-[300px]
          md:w-[100px] md:h-[148px]
          z-20
        "
        transition={{ duration: 0, ease: "linear" }}
      />
    )}
    </div>
  );
}
