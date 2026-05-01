"use client";

import { useEffect, useRef, useState } from "react";
import { interpolate } from "flubber";
import styles from "./OneZeroToI.module.css";

const RAW = {
  zero: "M3.03409 8.96591C2.39204 8.96591 1.84517 8.79119 1.39346 8.44176C0.941759 8.08949 0.596588 7.57954 0.357952 6.91193C0.119315 6.24147 -2.74181e-06 5.43182 -2.74181e-06 4.48295C-2.74181e-06 3.53977 0.119315 2.73437 0.357952 2.06676C0.599429 1.3963 0.94602 0.88494 1.39772 0.532667C1.85227 0.177554 2.39772 -3.09944e-06 3.03409 -3.09944e-06C3.67045 -3.09944e-06 4.21449 0.177554 4.66619 0.532667C5.12074 0.88494 5.46733 1.3963 5.70596 2.06676C5.94744 2.73437 6.06818 3.53977 6.06818 4.48295C6.06818 5.43182 5.94886 6.24147 5.71022 6.91193C5.47159 7.57954 5.12642 8.08949 4.67471 8.44176C4.22301 8.79119 3.67613 8.96591 3.03409 8.96591ZM3.03409 8.02841C3.67045 8.02841 4.16477 7.72159 4.51704 7.10795C4.86932 6.49432 5.04545 5.61932 5.04545 4.48295C5.04545 3.72727 4.96449 3.0838 4.80255 2.55255C4.64346 2.0213 4.41335 1.61647 4.11221 1.33807C3.81392 1.05966 3.45454 0.920452 3.03409 0.920452C2.40341 0.920452 1.91051 1.23153 1.5554 1.85369C1.20028 2.47301 1.02272 3.34943 1.02272 4.48295C1.02272 5.23863 1.10227 5.88068 1.26136 6.40909C1.42045 6.9375 1.64915 7.33949 1.94744 7.61505C2.24858 7.89062 2.61079 8.02841 3.03409 8.02841Z",
  e1: "M3 0.5C3.55968 0.5 4.17669 0.923045 4.68262 1.85059C5.17814 2.7592 5.5 4.04855 5.5 5.5C5.5 6.95145 5.17814 8.2408 4.68262 9.14941C4.17669 10.077 3.55968 10.5 3 10.5C2.44032 10.5 1.82331 10.077 1.31738 9.14941C0.821856 8.2408 0.5 6.95145 0.5 5.5C0.5 4.04855 0.821856 2.7592 1.31738 1.85059C1.82331 0.923045 2.44032 0.5 3 0.5Z",
  e2: "M3 0.5C4.31118 0.5 5.5 1.76806 5.5 3.5C5.5 5.23194 4.31118 6.5 3 6.5C1.68882 6.5 0.5 5.23194 0.5 3.5C0.5 1.76806 1.68882 0.5 3 0.5Z",
  e3: "M3 0.5C4.31118 0.5 5.5 1.76806 5.5 3.5C5.5 4.38715 5.18328 5.94891 4.65625 7.29199C4.39366 7.96112 4.09148 8.54333 3.77441 8.94824C3.44351 9.37083 3.1776 9.5 3 9.5C2.8224 9.5 2.55649 9.37083 2.22559 8.94824C1.90852 8.54333 1.60634 7.96112 1.34375 7.29199C0.816718 5.94891 0.5 4.38715 0.5 3.5C0.5 1.76806 1.68882 0.5 3 0.5Z",
  e4: "M3 0.5C3.5634 0.5 4.18226 0.952286 4.69531 1.78711C5.19438 2.59923 5.5 3.63441 5.5 4.5C5.5 6.23194 4.31118 7.5 3 7.5C1.68882 7.5 0.5 6.23194 0.5 4.5C0.5 3.63441 0.805618 2.59923 1.30469 1.78711C1.81774 0.952286 2.4366 0.5 3 0.5Z",
  e5: "M2 0.5C2.82843 0.5 3.5 1.17157 3.5 2C3.5 2.82843 2.82843 3.5 2 3.5C1.17157 3.5 0.5 2.82843 0.5 2C0.5 1.17157 1.17157 0.5 2 0.5Z",
  v1: "M0.19696 2.68605C3.69696 1.18605 2.69696 -0.813948 2.69696 1.68605V10.6861",
  v2: "M0.19696 1.52367C3.69696 0.0236664 1.69696 0.0236757 1.69696 2.52368V11.5237",
  v3: "M0.5 0V11",
  v4: "M0.5 0.500001V11.5",
  v5: "M0.5 0.500001V11.5",
};

// Natural bounding box (w, h) for each source path — used to compute center offset.
const BOX = {
  zero: [7, 9],
  e1: [6, 11],
  e2: [6, 7],
  e3: [6, 10],
  e4: [6, 8],
  e5: [4, 4],
  v1: [4, 11],
  v2: [3, 12],
  v3: [1, 11],
  v4: [1, 12],
  v5: [1, 12],
} as const;

// Strip D.zero's inner hole so path has a single subpath (needed for clean flubber morph).
function outerSubpath(d: string): string {
  const parts = d.split(/Z/i).map((s) => s.trim()).filter(Boolean);
  return parts[0] + "Z";
}

function fmt(n: number): string {
  return Math.abs(n) < 1e-6 ? "0" : Number(n.toFixed(5)).toString();
}

// Offsets every absolute coordinate in a path string by (dx, dy). Handles the
// uppercase commands produced by Figma exports: M, L, C, S, Q, T, V, H, Z.
function offsetPath(d: string, dx: number, dy: number): string {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  const out: string[] = [];
  let cmd = "";
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (/[a-zA-Z]/.test(t)) {
      cmd = t;
      out.push(t);
      i++;
      continue;
    }
    const upper = cmd.toUpperCase();
    if (upper === "Z") {
      i++;
      continue;
    }
    if (upper === "H") {
      out.push(fmt(+t + dx));
      i++;
    } else if (upper === "V") {
      out.push(fmt(+t + dy));
      i++;
    } else {
      const x = +tokens[i];
      const y = +tokens[i + 1];
      out.push(fmt(x + dx), fmt(y + dy));
      i += 2;
    }
  }
  return out.join(" ");
}

// Center each path around origin (0, 0) in a unified coordinate space.
function centered(key: keyof typeof RAW, raw: string): string {
  const [w, h] = BOX[key];
  return offsetPath(raw, -w / 2, -h / 2);
}

const TOP_FRAMES: string[] = [
  centered("zero", outerSubpath(RAW.zero)),
  centered("e1", RAW.e1),
  centered("e2", RAW.e2),
  centered("e3", RAW.e3),
  centered("e4", RAW.e4),
  centered("e5", RAW.e5),
];

const BOT_FRAMES: string[] = [
  centered("v1", RAW.v1),
  centered("v1", RAW.v1),
  centered("v2", RAW.v2),
  centered("v3", RAW.v3),
  centered("v4", RAW.v4),
  centered("v5", RAW.v5),
];

function buildInterpolators(frames: string[]): ((t: number) => string)[] {
  const out: ((t: number) => string)[] = [];
  for (let i = 0; i < frames.length - 1; i++) {
    try {
      out.push(interpolate(frames[i], frames[i + 1], { maxSegmentLength: 2 }));
    } catch {
      // Fall back to snap-at-half if flubber rejects a mismatched pair.
      const a = frames[i];
      const b = frames[i + 1];
      out.push((t: number) => (t < 0.5 ? a : b));
    }
  }
  return out;
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const MORPH_MS = 3200;
const HOLD_MS = 900;

export function OneZeroToI({ compact = false }: { compact?: boolean } = {}) {
  const topRef = useRef<SVGPathElement>(null);
  const botRef = useRef<SVGPathElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const top = topRef.current;
    const bot = botRef.current;
    if (!top || !bot) return;

    const topInterps = buildInterpolators(TOP_FRAMES);
    const botInterps = buildInterpolators(BOT_FRAMES);
    const lastTop = TOP_FRAMES[TOP_FRAMES.length - 1];
    const lastBot = BOT_FRAMES[BOT_FRAMES.length - 1];

    if (reducedMotion) {
      top.setAttribute("d", lastTop);
      bot.setAttribute("d", lastBot);
      return;
    }

    const cycle = MORPH_MS + HOLD_MS;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = (now - start) % cycle;
      if (elapsed < MORPH_MS) {
        const u = elapsed / MORPH_MS;
        const segCount = topInterps.length;
        const scaled = u * segCount;
        const segRaw = Math.floor(scaled);
        const seg = Math.min(segCount - 1, segRaw);
        const local = easeInOutCubic(Math.min(1, scaled - seg));
        top.setAttribute("d", topInterps[seg](local));
        bot.setAttribute("d", botInterps[seg](local));
      } else {
        top.setAttribute("d", lastTop);
        bot.setAttribute("d", lastBot);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  return (
    <div className={compact ? styles.rootCompact : styles.root}>
      <div className={`${styles.stage} ${compact ? styles.stageCompact : ""}`}>
        <svg
          className={`${styles.svg} ${styles.topSvg}`}
          viewBox="-6 -7 12 14"
          preserveAspectRatio="xMidYMax meet"
          aria-hidden
        >
          <path ref={topRef} fill="currentColor" d={TOP_FRAMES[0]} />
        </svg>
        <svg
          className={`${styles.svg} ${styles.botSvg}`}
          viewBox="-4 -7 8 14"
          preserveAspectRatio="xMidYMin meet"
          aria-hidden
        >
          <path
            ref={botRef}
            stroke="currentColor"
            strokeWidth={0.8}
            strokeLinecap="round"
            fill="none"
            d={BOT_FRAMES[0]}
          />
        </svg>
        {!compact && <div className={styles.caption}>0 · 1 → i</div>}
      </div>
    </div>
  );
}
