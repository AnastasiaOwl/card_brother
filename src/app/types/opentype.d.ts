declare module 'opentype.js' {
  export class Path {
    commands: PathCommand[];
    constructor();
    toPathData(): string;
    getBoundingBox?(): { x1: number; y1: number; x2: number; y2: number };
  }

  export interface Font {
    getPath(text: string, x: number, y: number, fontSize: number): Path;
  }

  export function load(
    url: string,
    callback: (err: Error | null, font?: Font) => void
  ): void;

  const opentype: {
    load: typeof load;
    Path: typeof Path;
  };

  export default opentype;
}
