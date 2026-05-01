export type Tweaks = {
  palette: string;
  density: number;
  speed: number;
  background: string;
  loop: boolean;
};

export const DEFAULT_TWEAKS: Tweaks = {
  palette: "warm",
  density: 88,
  speed: 0.8,
  background: "#f5ece2",
  loop: false,
};

type PortraitGridJson = {
  w: number;
  h: number;
  cells: [unknown, unknown, number, number, number, number][];
};

type Pixel = {
  cx: number;
  cy: number;
  w: number;
  h: number;
  r: number;
  g: number;
  b: number;
  l: number;
  fr?: number;
  fg?: number;
  fb?: number;
};

type PortraitBox = {
  x: number;
  y: number;
  w: number;
  h: number;
  cellW: number;
  cellH: number;
  cols: number;
  rows: number;
};

export type HeroAnimationElements = {
  canvas: HTMLCanvasElement;
  stage: HTMLElement;
  railStage: HTMLElement;
  rightSlot: HTMLElement;
  replayBtn: HTMLButtonElement;
  tweaksPanel: HTMLElement;
  tPalette: HTMLSelectElement;
  tDensity: HTMLInputElement;
  tSpeed: HTMLInputElement;
  tBg: HTMLInputElement;
  tLoop: HTMLInputElement;
  tDensityV: HTMLElement;
  tSpeedV: HTMLElement;
  tBgV: HTMLElement;
};

export type HeroAnimationOptions = {
  gridUrl?: string;
  reducedMotion?: boolean;
  onMorphProgress?: (progress: number) => void;
};

type PhaseKey =
  | "intro"
  | "pair"
  | "fill"
  | "pixelate"
  | "resolve"
  | "morphIn"
  | "morphStack"
  | "morphDot"
  | "morphI"
  | "end";

type Phase = { k: PhaseKey; at: number; to: number; label: string };

export function initHeroAnimation(
  el: HeroAnimationElements,
  initialTweaks: Tweaks,
  options: HeroAnimationOptions = {},
): () => void {
  const { gridUrl = "/assets/portrait-grid.json", onMorphProgress, reducedMotion = false } = options;

  const {
    canvas,
    stage,
    railStage,
    rightSlot,
    replayBtn,
    tweaksPanel,
    tPalette,
    tDensity,
    tSpeed,
    tBg,
    tLoop,
    tDensityV,
    tSpeedV,
    tBgV,
  } = el;

  const ctxMaybe = canvas.getContext("2d");
  if (!ctxMaybe) {
    console.error("2d context unavailable");
    return () => {};
  }
  const ctx = ctxMaybe;

  const TWEAKS: Tweaks = { ...initialTweaks };

  function syncTweakUI() {
    tPalette.value = TWEAKS.palette;
    tDensity.value = String(TWEAKS.density);
    tSpeed.value = String(TWEAKS.speed);
    tBg.value = TWEAKS.background;
    tLoop.checked = !!TWEAKS.loop;
    tDensityV.textContent = TWEAKS.density + " cols";
    tSpeedV.textContent = TWEAKS.speed + "x";
    tBgV.textContent = TWEAKS.background;
    document.documentElement.style.setProperty("--bg", TWEAKS.background);
  }

  function persist(partial: Partial<Tweaks>) {
    Object.assign(TWEAKS, partial);
    try {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: partial }, "*");
    } catch {
      /* ignore */
    }
  }

  const onPalette = () => {
    persist({ palette: tPalette.value });
    rebuildPortraitColors();
  };
  const onDensity = () => {
    tDensityV.textContent = tDensity.value + " cols";
    persist({ density: +tDensity.value });
    rebuildPortraitGrid();
  };
  const onSpeed = () => {
    tSpeedV.textContent = tSpeed.value + "x";
    persist({ speed: +tSpeed.value });
  };
  const onBg = () => {
    tBgV.textContent = tBg.value;
    persist({ background: tBg.value });
    document.documentElement.style.setProperty("--bg", tBg.value);
  };
  const onLoop = () => {
    persist({ loop: tLoop.checked });
  };

  tPalette.addEventListener("change", onPalette);
  tDensity.addEventListener("input", onDensity);
  tSpeed.addEventListener("input", onSpeed);
  tBg.addEventListener("input", onBg);
  tLoop.addEventListener("change", onLoop);

  const onMessage = (e: MessageEvent) => {
    const d = e.data || {};
    if (d.type === "__activate_edit_mode") tweaksPanel.classList.add("show");
    if (d.type === "__deactivate_edit_mode") tweaksPanel.classList.remove("show");
  };
  window.addEventListener("message", onMessage);
  try {
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
  } catch {
    /* ignore */
  }
  syncTweakUI();

  let W = 0,
    H = 0,
    DPR = 1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = stage.clientWidth;
    H = stage.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    rebuildPortraitGrid();
  }

  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  const MESSAGE = "We invest not in projects but in relationships";
  function toBinary(s: string) {
    let o = "";
    for (let i = 0; i < s.length; i++) o += s.charCodeAt(i).toString(2).padStart(8, "0");
    return o;
  }
  const MESSAGE_BITS = toBinary(MESSAGE);

  let GRID: PortraitGridJson | null = null;
  let PIXELS: Pixel[] = [];
  let PORTRAIT_BOX: PortraitBox | null = null;

  const PHASES: Phase[] = [
    { k: "intro", at: 0.0, to: 0.9, label: "stage · encoding" },
    { k: "pair", at: 0.9, to: 1.6, label: "stage · encoding" },
    { k: "fill", at: 1.6, to: 4.2, label: "stage · streaming" },
    { k: "pixelate", at: 4.2, to: 5.4, label: "stage · resolving" },
    { k: "resolve", at: 5.4, to: 6.2, label: "stage · settled" },
    { k: "morphIn", at: 6.2, to: 6.9, label: "stage · transmission" },
    { k: "morphStack", at: 6.9, to: 7.6, label: "stage · transmission" },
    { k: "morphDot", at: 7.6, to: 8.3, label: "stage · transmission" },
    { k: "morphI", at: 8.3, to: 9.0, label: "stage · transmission" },
    { k: "end", at: 9.0, to: 9.3, label: "stage · i" },
  ];
  const TOTAL = 9.3;

  function phaseAt(key: PhaseKey): Phase {
    return PHASES.find((p) => p.k === key) ?? PHASES[0];
  }

  function phaseActive(t: number): Phase {
    for (let i = PHASES.length - 1; i >= 0; i--) if (t >= PHASES[i].at) return PHASES[i];
    return PHASES[0];
  }

  function clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v));
  }

  const ease = {
    inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
    outQuart: (t: number) => 1 - Math.pow(1 - t, 4),
    inCubic: (t: number) => t * t * t,
  };

  /** Slow start, strong mid push, soft landing — reads as “streaming” bits. */
  function streamFillProgress(u: number) {
    u = clamp(u, 0, 1);
    if (u < 0.42) {
      const k = u / 0.42;
      return ease.inCubic(k) * 0.22;
    }
    const k = (u - 0.42) / 0.58;
    return 0.22 + ease.outCubic(k) * 0.78;
  }

  /** Deterministic [0,1] stagger key: radial from portrait center + mild cell hash. */
  function cellStagger01(i: number, cols: number, pb: PortraitBox) {
    const gx = i % cols;
    const gy = Math.floor(i / cols);
    const cx = pb.x + gx * pb.cellW + pb.cellW / 2;
    const cy = pb.y + gy * pb.cellH + pb.cellH / 2;
    const nx = (cx - (pb.x + pb.w / 2)) / (pb.w / 2 || 1);
    const ny = (cy - (pb.y + pb.h / 2)) / (pb.h / 2 || 1);
    const dist = Math.sqrt(nx * nx + ny * ny);
    const h = ((gx * 73856093) ^ (gy * 19349663)) >>> 0;
    const jitter = (h % 1000) / 1000;
    return clamp(dist / 1.45 + jitter * 0.14, 0, 1);
  }

  let t0 = performance.now();
  let paused = false;
  let rafId: number | null = null;

  function currentT() {
    return ((performance.now() - t0) / 1000) * TWEAKS.speed;
  }

  function getBg() {
    return (
      getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() ||
      TWEAKS.background
    );
  }

  function getInk() {
    return "#1c140e";
  }

  function clearBg() {
    ctx.fillStyle = getBg();
    ctx.fillRect(0, 0, W, H);
  }

  function remapColor(r: number, g: number, b: number, l: number, pal: string) {
    if (pal === "full") return [r, g, b];
    if (pal === "warm")
      return gradLookup(l, [
        [0, [22, 16, 12]],
        [0.22, [90, 28, 40]],
        [0.48, [217, 74, 106]],
        [0.7, [232, 105, 60]],
        [0.88, [242, 166, 90]],
        [1, [253, 230, 196]],
      ]);
    if (pal === "duotone")
      return gradLookup(l, [
        [0, [20, 14, 10]],
        [0.55, [217, 74, 106]],
        [1, [252, 235, 220]],
      ]);
    if (pal === "mono")
      return gradLookup(l, [
        [0, [16, 10, 4]],
        [0.55, [200, 120, 30]],
        [1, [255, 220, 140]],
      ]);
    if (pal === "cool")
      return gradLookup(l, [
        [0, [10, 12, 24]],
        [0.35, [50, 60, 120]],
        [0.65, [120, 140, 220]],
        [1, [220, 230, 250]],
      ]);
    return [r, g, b];
  }

  function gradLookup(t: number, stops: [number, number[]][]) {
    t = Math.max(0, Math.min(1, t));
    for (let i = 0; i < stops.length - 1; i++) {
      const [t0, c0] = stops[i],
        [t1, c1] = stops[i + 1];
      if (t >= t0 && t <= t1) {
        const k = (t - t0) / (t1 - t0 || 1);
        return [
          Math.round(c0[0] + (c1[0] - c0[0]) * k),
          Math.round(c0[1] + (c1[1] - c0[1]) * k),
          Math.round(c0[2] + (c1[2] - c0[2]) * k),
        ];
      }
    }
    return stops[stops.length - 1][1];
  }

  function rebuildPortraitGrid() {
    if (!GRID || !W || !H) return;
    const D = Math.max(20, Math.min(GRID.w, TWEAKS.density | 0));
    const stepX = GRID.w / D;
    const aspect = GRID.h / GRID.w;
    const rows = Math.round(D * aspect);
    const stepY = GRID.h / rows;
    const marginX = Math.max(40, W * 0.05);
    const availW = W * 0.5 - marginX * 2;
    const availH = H * 0.84;
    let cellH = availH / rows;
    let cellW = cellH;
    if (cellW * D > availW) {
      cellW = availW / D;
      cellH = cellW;
    }
    const portraitW = cellW * D;
    const portraitH = cellH * rows;
    const pX = marginX + (availW - portraitW) / 2;
    const pY = (H - portraitH) / 2;
    PORTRAIT_BOX = { x: pX, y: pY, w: portraitW, h: portraitH, cellW, cellH, cols: D, rows };
    PIXELS = new Array(D * rows);
    const cells = GRID.cells;
    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < D; gx++) {
        const sx = Math.min(GRID.w - 1, Math.floor(gx * stepX + stepX * 0.5));
        const sy = Math.min(GRID.h - 1, Math.floor(gy * stepY + stepY * 0.5));
        const [, , r, g, b, lum] = cells[sy * GRID.w + sx];
        PIXELS[gy * D + gx] = {
          cx: pX + gx * cellW + cellW / 2,
          cy: pY + gy * cellH + cellH / 2,
          w: cellW,
          h: cellH,
          r,
          g,
          b,
          l: lum,
        };
      }
    }
    rebuildPortraitColors();
    if (typeof window !== "undefined") (window as Window & { __PIXELS?: Pixel[] }).__PIXELS = PIXELS;
  }

  function rebuildPortraitColors() {
    if (!PIXELS.length) return;
    for (const p of PIXELS) {
      const [R, G, B] = remapColor(p.r, p.g, p.b, p.l, TWEAKS.palette);
      p.fr = R;
      p.fg = G;
      p.fb = B;
    }
  }

  // Continuous fractional typed-count. Chars fade in as this crosses integer boundaries.
  function typedContinuous(t: number, N: number) {
    const fillStart = phaseAt("fill").at;
    if (t < 0.05) return 0;
    if (t < 0.38) return ease.outCubic(clamp((t - 0.05) / 0.33, 0, 1));
    if (t < 0.78) return 1;
    if (t < 1.2) return 1 + ease.inOutCubic(clamp((t - 0.78) / 0.42, 0, 1));
    if (t < fillStart) return 2;
    const fillEnd = phaseAt("fill").to;
    if (t < fillEnd) {
      const local = (t - fillStart) / (fillEnd - fillStart);
      return 2 + (N - 2) * streamFillProgress(local);
    }
    return N;
  }

  // Compact grid layout for n chars inside the portrait box. Approximates portrait aspect so
  // cells stay roughly square. As n grows, cells shrink and the grid fills the box.
  type BigLayout = {
    cols: number;
    rows: number;
    cellW: number;
    cellH: number;
    x0: number;
    y0: number;
  };

  function computeBigLayout(n: number): BigLayout {
    const pb = PORTRAIT_BOX!;
    const aspect = pb.h / pb.w;
    const nEff = Math.max(2, n);
    const cols = Math.max(1, Math.ceil(Math.sqrt(nEff / aspect)));
    const rows = Math.max(1, Math.ceil(nEff / cols));
    const cellW = Math.min(pb.w / cols, pb.h / rows);
    const cellH = cellW;
    const totalW = cellW * cols;
    const totalH = cellH * rows;
    return {
      cols,
      rows,
      cellW,
      cellH,
      x0: pb.x + (pb.w - totalW) / 2,
      y0: pb.y + (pb.h - totalH) / 2,
    };
  }

  function drawIntroCaret(t: number, typedF: number) {
    if (reducedMotion || t >= phaseAt("fill").at || typedF >= 2 || !PORTRAIT_BOX) return;
    const L = computeBigLayout(2);
    const fontPx = Math.max(6, Math.round(L.cellW * 0.92));
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `500 ${fontPx}px "JetBrains Mono", ui-monospace, monospace`;
    const idx = Math.min(1, Math.floor(typedF));
    const bc = idx % L.cols;
    const br = Math.floor(idx / L.cols);
    const bx = L.x0 + bc * L.cellW + L.cellW / 2;
    const by = L.y0 + br * L.cellH + L.cellH / 2;
    const caretX = bx + L.cellW * 0.48;
    const caretY = by;
    const blink = 0.32 + 0.68 * (Math.sin(t * Math.PI * 2.75) * 0.5 + 0.5);
    ctx.fillStyle = getInk();
    ctx.globalAlpha = blink;
    const cw = Math.max(2, fontPx * 0.11);
    const ch = fontPx * 0.72;
    ctx.fillRect(caretX - cw / 2, caretY - ch / 2, cw, ch);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawResolveGrain(t: number) {
    if (reducedMotion || !PORTRAIT_BOX) return;
    if (t < phaseAt("resolve").at || t >= phaseAt("morphIn").at) return;
    const pb = PORTRAIT_BOX;
    const tick = Math.floor(t * 45);
    ctx.save();
    ctx.globalAlpha = 0.028;
    ctx.fillStyle = getInk();
    for (let k = 0; k < 96; k++) {
      const r = ((tick * 1103515245 + k * 12345) >>> 0) / 4294967296;
      const q = ((tick * 2246822519 + k * 3266489917) >>> 0) / 4294967296;
      const rx = pb.x + r * pb.w;
      const ry = pb.y + q * pb.h;
      ctx.fillRect(Math.floor(rx), Math.floor(ry), 1, 1);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function clipRoundedPortraitBox(pb: PortraitBox, radius: number) {
    const r = Math.min(radius, pb.w / 2, pb.h / 2);
    ctx.beginPath();
    ctx.moveTo(pb.x + r, pb.y);
    ctx.lineTo(pb.x + pb.w - r, pb.y);
    ctx.quadraticCurveTo(pb.x + pb.w, pb.y, pb.x + pb.w, pb.y + r);
    ctx.lineTo(pb.x + pb.w, pb.y + pb.h - r);
    ctx.quadraticCurveTo(pb.x + pb.w, pb.y + pb.h, pb.x + pb.w - r, pb.y + pb.h);
    ctx.lineTo(pb.x + r, pb.y + pb.h);
    ctx.quadraticCurveTo(pb.x, pb.y + pb.h, pb.x, pb.y + pb.h - r);
    ctx.lineTo(pb.x, pb.y + r);
    ctx.quadraticCurveTo(pb.x, pb.y, pb.x + r, pb.y);
    ctx.closePath();
    ctx.clip();
  }

  function drawLeftSequence(t: number) {
    if (!PORTRAIT_BOX || !PIXELS.length) return;
    const N = PIXELS.length;
    const pb = PORTRAIT_BOX;
    const cols = pb.cols;

    ctx.save();
    clipRoundedPortraitBox(pb, 16);

    const typedF = typedContinuous(t, N);
    const typedVisible = Math.min(N, Math.ceil(typedF));

    drawIntroCaret(t, typedF);
    if (typedVisible === 0) {
      ctx.restore();
      return;
    }

    // Big → grid interpolation spans the fill phase. Cap at 1 after fill.
    const fill = phaseAt("fill");
    const fillT = clamp((t - fill.at) / (fill.to - fill.at), 0, 1);
    const blend = ease.inOutCubic(fillT);

    const big = computeBigLayout(typedF);

    // Pixelate stagger — each cell crossfades within perCellWindow inside the pixelate phase.
    const pix = phaseAt("pixelate");
    const pixSpan = pix.to - pix.at;
    const perCellWindow = 0.35;
    const staggerSpan = Math.max(0.001, pixSpan - perCellWindow);

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = getInk();

    // All chars share the same font size in a given frame (big and grid cells are uniform),
    // so set the font once per glyph-size band.
    const firstPixel = PIXELS[0];
    const gSize = big.cellW + (firstPixel.w - big.cellW) * blend;
    const fontPx = Math.max(6, Math.round(gSize * 0.92));
    ctx.font = `500 ${fontPx}px "JetBrains Mono", ui-monospace, monospace`;

    const inFillGlyphs = t >= fill.at && t < fill.to;

    for (let i = 0; i < typedVisible; i++) {
      const pxCell = PIXELS[i];
      const bit = MESSAGE_BITS[i % MESSAGE_BITS.length];

      const bc = i % big.cols;
      const br = Math.floor(i / big.cols);
      const bx = big.x0 + bc * big.cellW + big.cellW / 2;
      const by = big.y0 + br * big.cellH + big.cellH / 2;

      const gx = bx + (pxCell.cx - bx) * blend;
      const gy = by + (pxCell.cy - by) * blend;

      let gyGlyph = gy;
      if (inFillGlyphs && blend < 0.97) {
        const ripple = Math.sin(t * 2.55 + i * 0.065 + br * 0.12) * 1.85 * (1 - blend);
        gyGlyph += ripple;
      }

      const age = typedF - i;
      const alpha =
        i === 0 && typedF < 1
          ? ease.outCubic(clamp(typedF, 0, 1))
          : ease.outCubic(clamp(age, 0, 1));

      const staggerKey = cellStagger01(i, cols, pb);
      const cellAt = pix.at + staggerKey * staggerSpan;
      const cellP = clamp((t - cellAt) / perCellWindow, 0, 1);
      const glyphA = 1 - ease.outCubic(cellP);
      const squareA = ease.inOutCubic(cellP);
      const sqScale = 0.92 + 0.08 * ease.inOutCubic(cellP);

      if (glyphA > 0.01 && alpha > 0.01) {
        ctx.globalAlpha = glyphA * alpha;
        ctx.fillText(bit, gx, gyGlyph);
      }

      if (squareA > 0.01) {
        ctx.globalAlpha = squareA;
        const fr = pxCell.fr ?? pxCell.r;
        const fg = pxCell.fg ?? pxCell.g;
        const fb = pxCell.fb ?? pxCell.b;
        ctx.fillStyle = `rgb(${fr},${fg},${fb})`;
        const s = Math.max(1, pxCell.w * 0.99);
        ctx.save();
        ctx.translate(pxCell.cx, pxCell.cy);
        ctx.scale(sqScale, sqScale);
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.restore();
        ctx.fillStyle = getInk();
      }
    }

    ctx.restore();
    ctx.globalAlpha = 1;
    drawResolveGrain(t);
    ctx.restore();
  }

  // Drive the right-side SVG morph: stage classes (layout) + data layers (which keyframe shows).
  function applyRightStages(t: number) {
    const inMorph = t >= phaseAt("morphIn").at;
    const morphStart = phaseAt("morphIn").at;
    const morphEnd = phaseAt("end").at;
    onMorphProgress?.(inMorph ? clamp((t - morphStart) / (morphEnd - morphStart), 0, 1) : 0);

    rightSlot.classList.toggle("show", inMorph);
    rightSlot.classList.toggle("stageStack", t >= phaseAt("morphStack").at);
    rightSlot.classList.toggle("stageDot", t >= phaseAt("morphDot").at);
    rightSlot.classList.toggle("stageI", t >= phaseAt("morphI").at);

    if (!inMorph) {
      rightSlot.removeAttribute("data-z-layer");
      rightSlot.removeAttribute("data-one-layer");
      return;
    }

    const ms = phaseAt("morphStack").at;
    const md = phaseAt("morphDot").at;
    const mI = phaseAt("morphI").at;

    let zLayer: string;
    let oneLayer: string;

    if (t < ms) {
      zLayer = "0";
      oneLayer = "0";
    } else if (t < md) {
      zLayer = "1";
      oneLayer = "0";
    } else if (t < mI) {
      const u = (t - md) / (mI - md);
      const k = Math.min(3, Math.floor(u * 4));
      zLayer = String(2 + k);
      oneLayer = "0";
    } else {
      zLayer = "5";
      oneLayer = "1";
    }

    rightSlot.dataset.zLayer = zLayer;
    rightSlot.dataset.oneLayer = oneLayer;
  }

  function renderAt(t: number) {
    clearBg();
    const active = phaseActive(t);
    railStage.textContent = active.label;
    drawLeftSequence(t);
    applyRightStages(t);
    if (t >= TOTAL - 0.15) replayBtn.classList.add("show");
    else replayBtn.classList.remove("show");
  }

  function frame() {
    if (paused) return;
    const tRaw = currentT();
    const t = Math.min(tRaw, TOTAL);
    renderAt(t);
    if (tRaw >= TOTAL && TWEAKS.loop) t0 = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    t0 = performance.now();
    rightSlot.classList.remove("show", "stageStack", "stageDot", "stageI");
    rightSlot.removeAttribute("data-z-layer");
    rightSlot.removeAttribute("data-one-layer");
    replayBtn.classList.remove("show");
    rafId = requestAnimationFrame(frame);
  }

  const onReplay = () => start();
  replayBtn.addEventListener("click", onReplay);

  const win = window as Window &
    typeof globalThis & {
      __pause?: () => void;
      __resume?: () => void;
      __frameAt?: (tSec: number) => void;
      __PIXELS?: Pixel[];
      __TWEAKS?: Tweaks;
    };

  fetch(gridUrl)
    .then((r) => r.json())
    .then(async (j: PortraitGridJson) => {
      GRID = j;
      if (document.fonts?.ready) {
        try {
          await document.fonts.load('500 80px "JetBrains Mono"');
        } catch {
          /* ignore */
        }
        try {
          await document.fonts.load('500 16px "JetBrains Mono"');
        } catch {
          /* ignore */
        }
        try {
          await document.fonts.ready;
        } catch {
          /* ignore */
        }
      }
      resize();
      win.__pause = () => {
        paused = true;
      };
      win.__resume = () => {
        paused = false;
        rafId = requestAnimationFrame(frame);
      };
      win.__frameAt = (tSec: number) => {
        renderAt(Math.min(tSec, TOTAL));
      };
      win.__PIXELS = PIXELS;
      win.__TWEAKS = TWEAKS;
      if (reducedMotion) {
        renderAt(TOTAL);
      } else {
        start();
      }
    })
    .catch((err) => console.error("grid load failed", err));

  return () => {
    if (rafId != null) cancelAnimationFrame(rafId);
    tPalette.removeEventListener("change", onPalette);
    tDensity.removeEventListener("input", onDensity);
    tSpeed.removeEventListener("input", onSpeed);
    tBg.removeEventListener("input", onBg);
    tLoop.removeEventListener("change", onLoop);
    window.removeEventListener("message", onMessage);
    window.removeEventListener("resize", onResize);
    replayBtn.removeEventListener("click", onReplay);
    delete win.__pause;
    delete win.__resume;
    delete win.__frameAt;
    delete win.__PIXELS;
    delete win.__TWEAKS;
  };
}
