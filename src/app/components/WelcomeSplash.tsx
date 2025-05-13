// components/WelcomeSplash.tsx
"use client";

import { useRef, useState, useEffect } from "react";

interface WelcomeSplashProps {
  duration?: number;
  spawnInterval?: number;
  maxTrailTime?: number;
  baseRadius?: number;
}

export default function WelcomeSplash({
  duration = 3.5,
  spawnInterval = 50,
  maxTrailTime = 1000,
  baseRadius = 20,
}: WelcomeSplashProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const ballGroupRef = useRef<SVGGElement>(null);

  const [ghosts, setGhosts] = useState<
    { id: number; x: number; y: number; born: number }[]
  >([]);

  const [size, setSize] = useState({ W: 0, H: 0 });
  useEffect(() => {
    const onResize = () =>
      setSize({ W: window.innerWidth, H: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const { W, H } = size;
    if (!W || !H) return;
    const pathEl = pathRef.current!;
    const ballG = ballGroupRef.current!;

    const d = [
      `M ${-0.1 * W},${-0.1 * H}`,
      `C ${0.2 * W},${0.15 * H} ${0.8 * W},${0.09 * H} ${0.85 * W},${0.3 * H}`,
      `S ${0.7 * W},${0.75 * H} ${0.3 * W},${0.7 * H}`,
      `S ${0.25 * W},${0.25 * H} ${0.6 * W},${0.2 * H}`,
      `S ${1.1 * W},${0.6 * H} ${0.5 * W},${0.5 * H}`,
    ].join(" ");
    pathEl.setAttribute("d", d);

    const totalLen = pathEl.getTotalLength();
    let startTime: number | null = null;
    let lastSpawn = 0;

    function animateFrame(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t01 = Math.min(elapsed / (duration * 1000), 1);

      const pt = pathEl.getPointAtLength(totalLen * t01);

      let scale: number;
      if (t01 < 0.6) {
        scale = 0.5 + ((t01 / 0.6) * (2 - 0.5));
      } else {
        scale = 2 - (((t01 - 0.6) / 0.4) * (2 - 1));
      }

      ballG.setAttribute(
        "transform",
        `translate(${pt.x},${pt.y}) scale(${scale})`
      );

      if (elapsed - lastSpawn > spawnInterval) {
        lastSpawn = elapsed;
        const id = Date.now() + Math.random();
        setGhosts((g) => [...g, { id, x: pt.x, y: pt.y, born: timestamp }]);
      }

      setGhosts((g) => g.filter((g) => timestamp - g.born < maxTrailTime));

      if (t01 < 1) {
        requestAnimationFrame(animateFrame);
      }
    }

    requestAnimationFrame(animateFrame);
  }, [size, duration, spawnInterval, maxTrailTime]);

  if (!size.W || !size.H) return null;

  return (
    <svg
      viewBox={`0 0 ${size.W} ${size.H}`}
      width="100%"
      height="100%"
      className="fixed inset-0 pointer-events-none"
    >
      <defs>
        <path ref={pathRef} fill="none" stroke="none" />
      </defs>

      {ghosts.map(({ id, x, y, born }) => (
        <circle
          key={id}
          cx={x}
          cy={y}
          r={baseRadius}
          fill="black"
          style={{
            opacity: 1 - (Date.now() - born) / maxTrailTime,
            transition: "opacity 0.2s linear",
          }}
        />
      ))}

      <g ref={ballGroupRef}>
        <circle cx={0} cy={0} r={baseRadius} fill="black" />
      </g>
    </svg>
  );
}
