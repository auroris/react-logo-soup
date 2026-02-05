export type AlignmentMode =
  | "bounds"
  | "visual-center"
  | "visual-center-x"
  | "visual-center-y";

export interface LogoSource {
  src: string;
  alt?: string;
}

export interface VisualCenter {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}

export interface NormalizedLogo {
  src: string;
  alt: string;
  originalWidth: number;
  originalHeight: number;
  contentBox?: BoundingBox;
  normalizedWidth: number;
  normalizedHeight: number;
  aspectRatio: number;
  pixelDensity?: number;
  visualCenter?: VisualCenter;
  croppedSrc?: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MeasurementResult {
  width: number;
  height: number;
  contentBox?: BoundingBox;
  pixelDensity?: number;
  visualCenter?: VisualCenter;
}

export interface ImageRenderProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  style: Record<string, string>;
}

export type RenderImageFn = (props: ImageRenderProps) => HTMLElement;

export interface ProcessLogosOptions {
  logos: (string | LogoSource)[];
  baseSize?: number;
  scaleFactor?: number;
  contrastThreshold?: number;
  densityAware?: boolean;
  densityFactor?: number;
  cropToContent?: boolean;
}

export interface LogoSoupOptions extends ProcessLogosOptions {
  alignBy?: AlignmentMode;
  gap?: number | string;
  renderImage?: RenderImageFn;
  className?: string;
  style?: Record<string, string>;
  onNormalized?: (logos: NormalizedLogo[]) => void;
}
