"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { DEFAULT_TWEAKS, initHeroAnimation } from "@/lib/hero-animation";
import { HeroMorphSequence, type HeroMorphSequenceHandle } from "./HeroMorphSequence";
import styles from "./HeroSection.module.css";

const HERO_HEADER_BINARY = "01001000 · 01101001";

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

export function HeroSection() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railStageRef = useRef<HTMLDivElement>(null);
  const rightSlotRef = useRef<HTMLDivElement>(null);
  const replayBtnRef = useRef<HTMLButtonElement>(null);
  const tweaksPanelRef = useRef<HTMLDivElement>(null);
  const tPaletteRef = useRef<HTMLSelectElement>(null);
  const tDensityRef = useRef<HTMLInputElement>(null);
  const tSpeedRef = useRef<HTMLInputElement>(null);
  const tBgRef = useRef<HTMLInputElement>(null);
  const tLoopRef = useRef<HTMLInputElement>(null);
  const tDensityVRef = useRef<HTMLSpanElement>(null);
  const tSpeedVRef = useRef<HTMLSpanElement>(null);
  const tBgVRef = useRef<HTMLSpanElement>(null);
  const headerBinaryRef = useRef<HTMLDivElement>(null);
  const morphRef = useRef<HeroMorphSequenceHandle>(null);

  useEffect(() => {
    if (reducedMotion) {
      const el = headerBinaryRef.current;
      if (el) el.textContent = HERO_HEADER_BINARY;
      return;
    }
    const el = headerBinaryRef.current;
    if (!el) return;
    el.textContent = HERO_HEADER_BINARY;
    let ticksToReset = 0;
    const id = window.setInterval(() => {
      const node = headerBinaryRef.current;
      if (!node) return;
      ticksToReset++;
      if (ticksToReset >= 9 || Math.random() < 0.12) {
        node.textContent = HERO_HEADER_BINARY;
        ticksToReset = 0;
        return;
      }
      const parts = HERO_HEADER_BINARY.split(" · ");
      const w = Math.random() < 0.5 ? 0 : 1;
      const chars = parts[w].split("");
      const idx = Math.floor(Math.random() * chars.length);
      chars[idx] = chars[idx] === "0" ? "1" : "0";
      parts[w] = chars.join("");
      node.textContent = `${parts[0]} · ${parts[1]}`;
    }, 520);
    return () => clearInterval(id);
  }, [reducedMotion]);

  useEffect(() => {
    if (
      !canvasRef.current ||
      !stageRef.current ||
      !railStageRef.current ||
      !rightSlotRef.current ||
      !replayBtnRef.current ||
      !tweaksPanelRef.current ||
      !tPaletteRef.current ||
      !tDensityRef.current ||
      !tSpeedRef.current ||
      !tBgRef.current ||
      !tLoopRef.current ||
      !tDensityVRef.current ||
      !tSpeedVRef.current ||
      !tBgVRef.current
    ) {
      return;
    }

    return initHeroAnimation(
      {
        canvas: canvasRef.current,
        stage: stageRef.current,
        railStage: railStageRef.current,
        rightSlot: rightSlotRef.current,
        replayBtn: replayBtnRef.current,
        tweaksPanel: tweaksPanelRef.current,
        tPalette: tPaletteRef.current,
        tDensity: tDensityRef.current,
        tSpeed: tSpeedRef.current,
        tBg: tBgRef.current,
        tLoop: tLoopRef.current,
        tDensityV: tDensityVRef.current,
        tSpeedV: tSpeedVRef.current,
        tBgV: tBgVRef.current,
      },
      DEFAULT_TWEAKS,
      {
        onMorphProgress: (progress) => morphRef.current?.setProgress(progress),
        reducedMotion,
      },
    );
  }, [reducedMotion]);

  return (
    <div className={styles.heroRoot}>
      <div className={styles.stage} ref={stageRef}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

        <div className={styles.landingText} aria-labelledby="hero-heading">
          <p className={styles.kicker}>iTelier / Your software partner</p>
          <h1 id="hero-heading" className={styles.title}>
            We invest not in projects but in relationships.
          </h1>
          <p className={styles.subtitle}>
            From zeros and ones to a human gaze - careful product, trust, and AI work for founders
            building what should last.
          </p>
        </div>

        <div className={`${styles.rail} ${styles.railTop}`}>
          <div>
            <span className={styles.dot} />
            iTelier
          </div>
          <div ref={headerBinaryRef}>{HERO_HEADER_BINARY}</div>
        </div>
        <div className={`${styles.rail} ${styles.railBot}`}>
          <div ref={railStageRef}>stage · intro</div>
          {/* <div>Warm / 0.1</div> */}
        </div>

        <div ref={rightSlotRef} className={styles.rightSlot} aria-hidden="true">
          <HeroMorphSequence ref={morphRef} compact autoPlay={false} />
        </div>

        <button
          ref={replayBtnRef}
          type="button"
          className={styles.replay}
          title="Replay"
          hidden={reducedMotion}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
          Replay
        </button>
      </div>

      <div ref={tweaksPanelRef} className={styles.tweaks} id="hero-tweaks">
        <h3>
          Tweaks <span className={styles.val} id="tStatus" />
        </h3>

        <label htmlFor="tPalette">Palette</label>
        <select ref={tPaletteRef} id="tPalette">
          <option value="warm">Warm oranges / pinks</option>
          <option value="full">Full color (Vermeer)</option>
          <option value="duotone">Duotone (pink + ink)</option>
          <option value="mono">Mono amber</option>
          <option value="cool">Cool blues</option>
        </select>

        <label htmlFor="tDensity">
          Grid density <span ref={tDensityVRef} className={styles.val} id="tDensityV" />
        </label>
        <input
          ref={tDensityRef}
          type="range"
          id="tDensity"
          min={40}
          max={120}
          step={4}
          defaultValue={DEFAULT_TWEAKS.density}
        />

        <label htmlFor="tSpeed">
          Animation speed <span ref={tSpeedVRef} className={styles.val} id="tSpeedV" />
        </label>
        <input
          ref={tSpeedRef}
          type="range"
          id="tSpeed"
          min={0.4}
          max={2}
          step={0.1}
          defaultValue={DEFAULT_TWEAKS.speed}
        />

        <label htmlFor="tBg">Background</label>
        <div className={styles.row}>
          <input ref={tBgRef} type="color" id="tBg" defaultValue="#f5ece2" />
          <span ref={tBgVRef} className={styles.val} id="tBgV">
            #f5ece2
          </span>
        </div>

        <label className={styles.chk} htmlFor="tLoop" style={{ marginTop: 12 }}>
          <input ref={tLoopRef} type="checkbox" id="tLoop" /> <span>Loop continuously</span>
        </label>
      </div>
    </div>
  );
}
