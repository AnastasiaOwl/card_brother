// src/app/components/WalkingGirl.tsx
"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const frames = ["/images/walk1.png", "/images/walk2.png","/images/walk3.png", "/images/walk4.png"];

interface Props {
  speed?: number;
  width?: number;
  height?: number;
}

export default function SpriteWolker({
  speed = 330,
  width = 128,
  height = 128,
}: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % frames.length);
    }, speed);
    return () => clearInterval(id);
  }, [speed]);

  return (
    <> <Image
    src={frames[idx]}
    alt="walking girl"
    width={width}
    height={height}
    className="select-none"
    draggable={false}
  />
  </>
  );
}

  