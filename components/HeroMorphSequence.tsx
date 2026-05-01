"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useSyncExternalStore,
} from "react";
import { interpolate } from "flubber";
import styles from "./HeroMorphSequence.module.css";

const RAW = {
  zero:
    "M3.03409 8.96591C2.39204 8.96591 1.84517 8.79119 1.39346 8.44176C0.941759 8.08949 0.596588 7.57954 0.357952 6.91193C0.119315 6.24147 -2.74181e-06 5.43182 -2.74181e-06 4.48295C-2.74181e-06 3.53977 0.119315 2.73437 0.357952 2.06676C0.599429 1.3963 0.94602 0.88494 1.39772 0.532667C1.85227 0.177554 2.39772 -3.09944e-06 3.03409 -3.09944e-06C3.67045 -3.09944e-06 4.21449 0.177554 4.66619 0.532667C5.12074 0.88494 5.46733 1.3963 5.70596 2.06676C5.94744 2.73437 6.06818 3.53977 6.06818 4.48295C6.06818 5.43182 5.94886 6.24147 5.71022 6.91193C5.47159 7.57954 5.12642 8.08949 4.67471 8.44176C4.22301 8.79119 3.67613 8.96591 3.03409 8.96591ZM3.03409 8.02841C3.67045 8.02841 4.16477 7.72159 4.51704 7.10795C4.86932 6.49432 5.04545 5.61932 5.04545 4.48295C5.04545 3.72727 4.96449 3.0838 4.80255 2.55255C4.64346 2.0213 4.41335 1.61647 4.11221 1.33807C3.81392 1.05966 3.45454 0.920452 3.03409 0.920452C2.40341 0.920452 1.91051 1.23153 1.5554 1.85369C1.20028 2.47301 1.02272 3.34943 1.02272 4.48295C1.02272 5.23863 1.10227 5.88068 1.26136 6.40909C1.42045 6.9375 1.64915 7.33949 1.94744 7.61505C2.24858 7.89062 2.61079 8.02841 3.03409 8.02841Z",
  one: "M3.23865 6.67572e-06V8.72728H2.18183V1.10796H2.1307L1.38879e-05 2.52273V1.44887L2.18183 6.67572e-06H3.23865Z",
  e1: "M3 0.5C3.55968 0.5 4.17669 0.923045 4.68262 1.85059C5.17814 2.7592 5.5 4.04855 5.5 5.5C5.5 6.95145 5.17814 8.2408 4.68262 9.14941C4.17669 10.077 3.55968 10.5 3 10.5C2.44032 10.5 1.82331 10.077 1.31738 9.14941C0.821856 8.2408 0.5 6.95145 0.5 5.5C0.5 4.04855 0.821856 2.7592 1.31738 1.85059C1.82331 0.923045 2.44032 0.5 3 0.5Z",
  e2: "M3 0.5C4.31118 0.5 5.5 1.76806 5.5 3.5C5.5 5.23194 4.31118 6.5 3 6.5C1.68882 6.5 0.5 5.23194 0.5 3.5C0.5 1.76806 1.68882 0.5 3 0.5Z",
  e3: "M3 0.5C4.31118 0.5 5.5 1.76806 5.5 3.5C5.5 4.38715 5.18328 5.94891 4.65625 7.29199C4.39366 7.96112 4.09148 8.54333 3.77441 8.94824C3.44351 9.37083 3.1776 9.5 3 9.5C2.8224 9.5 2.55649 9.37083 2.22559 8.94824C1.90852 8.54333 1.60634 7.96112 1.34375 7.29199C0.816718 5.94891 0.5 4.38715 0.5 3.5C0.5 1.76806 1.68882 0.5 3 0.5Z",
  e4: "M3 0.5C3.5634 0.5 4.18226 0.952286 4.69531 1.78711C5.19438 2.59923 5.5 3.63441 5.5 4.5C5.5 6.23194 4.31118 7.5 3 7.5C1.68882 7.5 0.5 6.23194 0.5 4.5C0.5 3.63441 0.805618 2.59923 1.30469 1.78711C1.81774 0.952286 2.4366 0.5 3 0.5Z",
  e5: "M2 0.5C2.82843 0.5 3.5 1.17157 3.5 2C3.5 2.82843 2.82843 3.5 2 3.5C1.17157 3.5 0.5 2.82843 0.5 2C0.5 1.17157 1.17157 0.5 2 0.5Z",
};

const BOX = {
  zero: [7, 9],
  one: [4, 9],
  e1: [6, 11],
  e2: [6, 7],
  e3: [6, 10],
  e4: [6, 8],
  e5: [4, 4],
} as const;

type RawKey = keyof typeof RAW;
type TransformFrame = {
  at: number;
  topX: number;
  topY: number;
  topScale: number;
  botX: number;
  botY: number;
  botScale: number;
};

export type HeroMorphSequenceHandle = {
  setProgress: (progress: number) => void;
  reset: () => void;
};

type HeroMorphSequenceProps = {
  compact?: boolean;
  autoPlay?: boolean;
  className?: string;
  ariaLabel?: string;
};

// const MORPH_MS = 4300;
// const HOLD_MS = 900;

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function outerSubpath(d: string): string {
  const parts = d
    .split(/Z/i)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts[0] + "Z";
}

function fmt(n: number): string {
  return Math.abs(n) < 1e-6 ? "0" : Number(n.toFixed(5)).toString();
}

function offsetPath(d: string, dx: number, dy: number): string {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  const out: string[] = [];
  let cmd = "";
  let currentX = 0;
  let currentY = 0;
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];
    if (/[a-zA-Z]/.test(token)) {
      cmd = token;
      if (!/[HV]/i.test(token)) out.push(token);
      i++;
      continue;
    }

    const upper = cmd.toUpperCase();
    if (upper === "Z") {
      i++;
      continue;
    }

    if (upper === "H") {
      currentX = +token + dx;
      out.push("L", fmt(currentX), fmt(currentY));
      i++;
    } else if (upper === "V") {
      currentY = +token + dy;
      out.push("L", fmt(currentX), fmt(currentY));
      i++;
    } else {
      const x = +tokens[i];
      const y = +tokens[i + 1];
      currentX = x + dx;
      currentY = y + dy;
      out.push(fmt(currentX), fmt(currentY));
      i += 2;
    }
  }

  return out.join(" ");
}

function centered(key: RawKey, raw: string): string {
  const [w, h] = BOX[key];
  return offsetPath(raw, -w / 2, -h / 2);
}

// Clean digit-1 silhouette as a 6-vertex polygon (no degenerate edges, no duplicate
// points). Replaces RAW.one for flubber morphing — the original path's near-zero coord
// (1.38879e-05) and ~0.05-unit edge between H2.18183/H2.1307 caused NaN in flubber's
// polygon normalization step.
function flaggedOnePath(): string {
  const w = 0.9;
  const h = 4.5;
  const flagX = -2.2;
  return [
    `M ${fmt(-w)} ${fmt(-h)}`,
    `L ${fmt(w)} ${fmt(-h)}`,
    `L ${fmt(w)} ${fmt(h)}`,
    `L ${fmt(flagX)} ${fmt(h - 1.4)}`,
    `L ${fmt(flagX)} ${fmt(h - 2.8)}`,
    `L ${fmt(-w)} ${fmt(h - 1)}`,
    "Z",
  ].join(" ");
}

function stemPath(width: number, height: number): string {
  const x = width / 2;
  const y = height / 2;
  const r = Math.min(x, 0.42);
  return [
    `M${fmt(-x)} ${fmt(-y + r)}`,
    `C${fmt(-x)} ${fmt(-y + r * 0.45)} ${fmt(-x + r * 0.45)} ${fmt(-y)} 0 ${fmt(-y)}`,
    `C${fmt(x - r * 0.45)} ${fmt(-y)} ${fmt(x)} ${fmt(-y + r * 0.45)} ${fmt(x)} ${fmt(-y + r)}`,
    `L${fmt(x)} ${fmt(y - r)}`,
    `C${fmt(x)} ${fmt(y - r * 0.45)} ${fmt(x - r * 0.45)} ${fmt(y)} 0 ${fmt(y)}`,
    `C${fmt(-x + r * 0.45)} ${fmt(y)} ${fmt(-x)} ${fmt(y - r * 0.45)} ${fmt(-x)} ${fmt(y - r)}`,
    "Z",
  ].join(" ");
}

const TOP_FRAMES = [
  centered("zero", outerSubpath(RAW.zero)),
  centered("e1", RAW.e1),
  centered("e2", RAW.e2),
  centered("e3", RAW.e3),
  centered("e4", RAW.e4),
  centered("e5", RAW.e5),
];

const BOT_FRAMES = [
  flaggedOnePath(),
  stemPath(1.8, 9.8),
  stemPath(1.35, 10.5),
  stemPath(1.05, 11.1),
  stemPath(0.82, 11.5),
  stemPath(0.78, 11.5),
];

const TRANSFORM_FRAMES: TransformFrame[] = [
  { at: 0, topX: 22, topY: 0, topScale: 7.2, botX: -22, botY: 0, botScale: 7.3 },
  { at: 0.2, topX: -6, topY: -38, topScale: 7.5, botX: 0, botY: 23, botScale: 7.4 },
  { at: 0.42, topX: 0, topY: -40, topScale: 7.7, botX: 0, botY: 23, botScale: 7.5 },
  { at: 0.62, topX: 0, topY: -43, topScale: 7.3, botX: 0, botY: 23, botScale: 7.6 },
  { at: 0.82, topX: 0, topY: -44, topScale: 6.7, botX: 0, botY: 23, botScale: 7.65 },
  { at: 1, topX: 0, topY: -44, topScale: 6.2, botX: 0, botY: 23, botScale: 7.65 },
];

function isValidPath(d: string) {
  return !d.includes("NaN") && !d.includes("undefined");
}

function fallbackInterpolate(a: string, b: string) {
  return (t: number) => (t < 0.5 ? a : b);
}

const VALIDATION_SAMPLES = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1];

function buildInterpolators(frames: string[]): ((t: number) => string)[] {
  return frames.slice(0, -1).map((frame, index) => {
    const next = frames[index + 1];
    try {
      const morph = interpolate(frame, next, { maxSegmentLength: 2 });
      const allValid = VALIDATION_SAMPLES.every((t) => {
        try {
          return isValidPath(morph(t));
        } catch {
          return false;
        }
      });
      return allValid ? morph : fallbackInterpolate(frame, next);
    } catch {
      return fallbackInterpolate(frame, next);
    }
  });
}

const TOP_INTERPOLATORS = buildInterpolators(TOP_FRAMES);
const BOT_INTERPOLATORS = buildInterpolators(BOT_FRAMES);

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smoother(t: number) {
  t = clamp01(t);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function samplePath(frames: string[], interpolators: ((t: number) => string)[], progress: number) {
  const p = clamp01(progress);
  if (p >= 1) return frames[frames.length - 1];
  const scaled = p * interpolators.length;
  const segment = Math.min(interpolators.length - 1, Math.floor(scaled));
  let path: string;
  try {
    path = interpolators[segment](smoother(scaled - segment));
  } catch {
    return frames[segment];
  }
  return isValidPath(path) ? path : frames[segment];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function sampleTransform(progress: number): TransformFrame {
  const p = clamp01(progress);
  for (let i = 0; i < TRANSFORM_FRAMES.length - 1; i++) {
    const a = TRANSFORM_FRAMES[i];
    const b = TRANSFORM_FRAMES[i + 1];
    if (p >= a.at && p <= b.at) {
      const t = smoother((p - a.at) / (b.at - a.at || 1));
      return {
        at: p,
        topX: lerp(a.topX, b.topX, t),
        topY: lerp(a.topY, b.topY, t),
        topScale: lerp(a.topScale, b.topScale, t),
        botX: lerp(a.botX, b.botX, t),
        botY: lerp(a.botY, b.botY, t),
        botScale: lerp(a.botScale, b.botScale, t),
      };
    }
  }
  return TRANSFORM_FRAMES[TRANSFORM_FRAMES.length - 1];
}

function toTransform(x: number, y: number, scale: number) {
  return `translate(${fmt(x)} ${fmt(y)}) scale(${fmt(scale)})`;
}

export const HeroMorphSequence = forwardRef<HeroMorphSequenceHandle, HeroMorphSequenceProps>(
  function HeroMorphSequence(
    { compact = false, className = "", ariaLabel = "Animated 0 and 1 morphing into i" },
    ref,
  ) {
    const topPathRef = useRef<SVGPathElement>(null);
    const botPathRef = useRef<SVGPathElement>(null);
    const topGroupRef = useRef<SVGGElement>(null);
    const botGroupRef = useRef<SVGGElement>(null);
    const sliderRef = useRef<HTMLInputElement>(null);
    const progressTextRef = useRef<HTMLSpanElement>(null);
    // const manualControlRef = useRef(false);
    const reducedMotion = useSyncExternalStore(
      subscribeReducedMotion,
      getReducedMotionSnapshot,
      getReducedMotionServerSnapshot,
    );

    const renderProgress = useCallback((progress: number) => {
      const p = clamp01(progress);
      const transform = sampleTransform(p);

      topPathRef.current?.setAttribute("d", samplePath(TOP_FRAMES, TOP_INTERPOLATORS, p));
      botPathRef.current?.setAttribute("d", samplePath(BOT_FRAMES, BOT_INTERPOLATORS, p));
      topGroupRef.current?.setAttribute(
        "transform",
        toTransform(transform.topX, transform.topY, transform.topScale),
      );
      botGroupRef.current?.setAttribute(
        "transform",
        toTransform(transform.botX, transform.botY, transform.botScale),
      );
      if (sliderRef.current) sliderRef.current.value = String(Math.round(p * 1000));
      if (progressTextRef.current) progressTextRef.current.textContent = p.toFixed(3);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        // 1/0 → i animation disabled for now.
        setProgress: () => undefined,
        reset: () => renderProgress(0),
      }),
      [renderProgress],
    );

    useEffect(() => {
      renderProgress(0);
    }, [reducedMotion, renderProgress]);

    // 1/0 → i auto-play animation disabled for now.
    // useEffect(() => {
    //   if (reducedMotion || !autoPlay) return;
    //
    //   let rafId = 0;
    //   const start = performance.now();
    //   const cycle = MORPH_MS + HOLD_MS;
    //
    //   const tick = (now: number) => {
    //     if (manualControlRef.current) return;
    //
    //     const elapsed = (now - start) % cycle;
    //     const progress = elapsed < MORPH_MS ? elapsed / MORPH_MS : 1;
    //     renderProgress(progress);
    //     rafId = requestAnimationFrame(tick);
    //   };
    //
    //   rafId = requestAnimationFrame(tick);
    //   return () => cancelAnimationFrame(rafId);
    // }, [autoPlay, reducedMotion, renderProgress]);

    // const onScrub = (event: ChangeEvent<HTMLInputElement>) => {
    //   manualControlRef.current = true;
    //   renderProgress(Number(event.target.value) / 1000);
    // };

    return (
      <div
        className={`${compact ? styles.rootCompact : styles.root} ${className}`}
        aria-label={ariaLabel}
        role="img"
      >
        {/* First frame disabled for now.
        <svg className={styles.svg} viewBox="-72 -88 144 176" aria-hidden="true">
          <g ref={topGroupRef} transform={toTransform(22, 0, 7.2)}>
            <path ref={topPathRef} fill="currentColor" d={TOP_FRAMES[0]} />
          </g>
          <g ref={botGroupRef} transform={toTransform(-22, 0, 7.3)}>
            <path ref={botPathRef} fill="currentColor" d={BOT_FRAMES[0]} />
          </g>
        </svg>
        */}
        {/* {!compact && (
          <div className={styles.controls}>
            <label className={styles.sliderLabel} htmlFor="heroMorphProgress">
              <span>Frame scrub</span>
              <span ref={progressTextRef}>0.000</span>
            </label>
            <input
              ref={sliderRef}
              className={styles.slider}
              id="heroMorphProgress"
              type="range"
              min="0"
              max="1000"
              step="1"
              defaultValue="0"
              onChange={onScrub}
              aria-label="Scrub morph animation progress"
            />
            <div className={styles.caption}>1 · 0 → i</div>
          </div>
        )} */}
      </div>
    );
  },
);
