"use client";

import { useRef, useEffect, useState } from "react";

interface WelcomeSplashProps {
  /** CSS color for the ball and tail (hex, rgb, etc.) */
  color?: string;
  /** total flight time in seconds */
  duration?: number;
  /** how often to sample the ball’s position (ms) */
  sampleInterval?: number;
  /** how long the tail lives (ms) */
  maxTrailTime?: number;
  /** “resting” radius of the core ball */
  baseRadius?: number;
  /** how wide the tail is at the very start, relative to baseRadius */
  tailWidthFactor?: number;
}

export default function WelcomeSplash({
  color           = "#f87171",
  duration        = 3.5,
  sampleInterval  = 16,
  maxTrailTime    = 800,
  baseRadius      = 40,
  tailWidthFactor = 2,
}: WelcomeSplashProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathRef   = useRef<SVGPathElement>(null);
  const ballRef   = useRef<SVGGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const pointsRef = useRef<{ x: number; y: number; scale: number; t: number }[]>([]);

  // resize to viewport
  useEffect(() => {
    const onResize = () => {
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      setSize({ w: cw, h: ch });
      if (canvasRef.current) {
        canvasRef.current.width = cw;
        canvasRef.current.height = ch;
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // parse hex or rgb to {r,g,b}
  function parseColor(col: string) {
    const m1 = col.match(/^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/i);
    if (m1) return { r: +m1[1], g: +m1[2], b: +m1[3] };
    const m2 = col.match(/^#?([A-Fa-f0-9]{6})$/);
    if (m2) {
      const v = m2[1];
      return { r: parseInt(v.slice(0,2),16), g: parseInt(v.slice(2,4),16), b: parseInt(v.slice(4,6),16) };
    }
    return { r: 0, g: 0, b: 0 };
  }

  useEffect(() => {
    if (!size.w || !size.h) return;
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    const pathEl = pathRef.current!;
    const ballG  = ballRef.current!;

    // fill color and RGB channels
    const fillColor = color;
    const { r, g, b } = parseColor(fillColor);

    // build path
    const cmds = [
      `M ${-0.1*size.w},${-0.1*size.h}`,
      `C ${0.2*size.w},${0.15*size.h} ${0.8*size.w},${0.09*size.h} ${0.85*size.w},${0.3*size.h}`,
      `S ${0.7*size.w},${0.75*size.h} ${0.3*size.w},${0.7*size.h}`,
      `S ${0.25*size.w},${0.25*size.h} ${0.6*size.w},${0.2*size.h}`,
      `S ${1.1*size.w},${0.6*size.h} ${0.5*size.w},${0.5*size.h}`,
    ];
    pathEl.setAttribute("d", cmds.join(" "));
    const totalLen = pathEl.getTotalLength();

    let startTime: number | null = null;
    let lastSample = 0;

    function animate(ts: number) {
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime;
      const t01 = Math.min(elapsed / (duration * 1000), 1);

      // point & scale
      const pt = pathEl.getPointAtLength(totalLen * t01);
      const scale = t01 < 0.6
        ? 0.5 + (t01/0.6)*(2-0.5)
        : 2 - ((t01-0.6)/0.4)*(2-1);
      ballG.setAttribute("transform", `translate(${pt.x},${pt.y}) scale(${scale})`);

      const now = performance.now();
      // only sample while moving
      if (t01 < 1 && now - lastSample > sampleInterval) {
        lastSample = now;
        pointsRef.current.push({ x: pt.x, y: pt.y, scale, t: now });
      }
      // age out samples
      pointsRef.current = pointsRef.current.filter(p => now - p.t < maxTrailTime);

      // clear & draw tail
      ctx.clearRect(0, 0, size.w, size.h);
      ctx.lineCap = "round";
      for (let i=0; i+1<pointsRef.current.length; i++) {
        const p0 = pointsRef.current[i];
        const p1 = pointsRef.current[i+1];
        const age = (now - p0.t)/maxTrailTime;
        const w = baseRadius * p0.scale * tailWidthFactor * (1-age);
        const a = 1-age;
        ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(p0.x,p0.y);
        ctx.lineTo(p1.x,p1.y);
        ctx.stroke();
      }

      // glowing head
      ctx.save();
      ctx.beginPath();
      ctx.arc(pt.x,pt.y, baseRadius*scale, 0, Math.PI*2);
      ctx.fillStyle = fillColor;
      ctx.shadowColor = fillColor;
      ctx.shadowBlur = baseRadius*0.75;
      ctx.fill();
      ctx.restore();

      // continue animating while moving or while samples remain
      if (t01 < 1 || pointsRef.current.length > 0) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [size, color, duration, sampleInterval, maxTrailTime, baseRadius, tailWidthFactor]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none bg-yellow-200"
        style={{ display: size.w ? "block" : "none" }}
      />
      <svg
        viewBox={`0 0 ${size.w} ${size.h}`}
        width="100%" height="100%"
        className="fixed inset-0 pointer-events-none"
      >
        <defs><path ref={pathRef} fill="none" stroke="none"/></defs>
        <g ref={ballRef}>
          <circle cx={0} cy={0} r={baseRadius} fill={color} />
        </g>
      </svg>
    </>
  );
}

