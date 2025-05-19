// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import WelcomeSplash from "../components/WelcomeSplash";

export default function Dashboard() {
  const [walkStarted, setWalkStarted] = useState(false);
  const [showStill, setShowStill]   = useState(false);

useEffect(() => {

  const t1 = setTimeout(() => setWalkStarted(true), 6000);
  const t2 = setTimeout(() => setShowStill(true), 14000);

  return () => {
    clearTimeout(t1);
    clearTimeout(t2);
  };
}, []);

  return (
    <div className="h-screen bg-yellow-200 relative overflow-hidden">
      <WelcomeSplash />

     {walkStarted && !showStill && (
      <motion.div 
      className="fixed top-[26%] left-[55%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999]"
          initial={{ x: "100vw" }}
          animate={{ x: 0 }}
          transition={{ duration: 8, ease: "linear" }}
          onAnimationComplete={() => setShowStill(true)}
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

    {showStill && (
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
