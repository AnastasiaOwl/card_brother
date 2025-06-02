import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import * as opentype from 'opentype.js';


type PathCommand = {
  type: string;
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
};

interface MinimalGlyph {
  getPath: (x: number, y: number, fontSize: number) => opentype.Path;
  advanceWidth: number;
}


interface FontWithMethods extends opentype.Font {
  charToGlyph: (s: string) => MinimalGlyph;
  unitsPerEm: number;
}


interface Props {
  text: string;
  fontUrl: string;
  fontSize: number;
}

interface LetterPath {
  d: string;
  key: string;
}

export default function HandwritingSVG({ text, fontUrl, fontSize }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [letterPaths, setLetterPaths] = useState<LetterPath[]>([]);
  const viewBoxWidth = 800;
  const viewBoxHeight = 200;
  const baseFontSize = 50;

  useEffect(() => {
    opentype.load(fontUrl, (err: Error | null, font?: opentype.Font) => {
      if (err || !font) {
        console.error(err);
        return;
      }
      const scale = fontSize / baseFontSize;
      let x = 0;
      const y = baseFontSize * 1.1;
      const paths: LetterPath[] = [];
      const realFont = font as FontWithMethods;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const glyph = realFont.charToGlyph(char);
        const glyphPath = glyph.getPath(x, y, baseFontSize);
        
        const scaledCommands = glyphPath.commands.map((cmd: PathCommand) => {

          const newCmd = { ...cmd };
          if ('x' in cmd) newCmd.x = (cmd.x ?? 0) * scale;
          if ('y' in cmd) newCmd.y = (cmd.y ?? 0) * scale;
          if ('x1' in cmd) newCmd.x1 = (cmd.x1 ?? 0) * scale;
          if ('y1' in cmd) newCmd.y1 = (cmd.y1 ?? 0) * scale;
          if ('x2' in cmd) newCmd.x2 = (cmd.x2 ?? 0) * scale;
          if ('y2' in cmd) newCmd.y2 = (cmd.y2 ?? 0) * scale;
          return newCmd;
        });
        
        const scaledPath = new opentype.Path();

        scaledPath.commands = scaledCommands;

        paths.push({ d: scaledPath.toPathData(), key: `${char}-${i}` });

        x += glyph.advanceWidth * (fontSize / realFont.unitsPerEm);
      }
      setLetterPaths(paths);
    });
  }, [text, fontUrl, fontSize]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;

    svg.innerHTML = '';

    letterPaths.forEach((lp) => {
      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('d', lp.d);
      pathEl.setAttribute('fill', 'none');
      pathEl.setAttribute('stroke', '#000');
      pathEl.setAttribute('stroke-width', '2');
      svg.appendChild(pathEl);
    });

    const paths = Array.from(svg.querySelectorAll('path'));
    const baseDelay = 1;
    paths.forEach((path, idx) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length.toString();
      path.style.strokeDashoffset = length.toString();
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.6,
        delay: baseDelay + idx * 0.5,
        ease: 'power1.inOut',
      });
    });
  }, [letterPaths]);

  return (
    <div className="w-full mx-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="overflow-visible w-full h-auto"
      />
    </div>
  );
}
