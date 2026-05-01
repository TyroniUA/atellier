/* Section 0 hero — v6
   Timeline (6s):
   0.0-0.6  type "0" with blinking caret
   0.6-1.1  type "1" → "01▮"
   1.1-3.2  rapidly type the BINARY of "We invest not in projects but in relationships"
            into a readable monospace block (~16px rows), filling the viewport.
            Message repeats to fill all cells.
   3.2-5.0  zoom out + cross-dissolve:
              - text block scales down & drifts toward the portrait footprint
              - the text fades out as the COLORED PORTRAIT PIXEL GRID fades in
   5.0-6.0  settle; right-side placeholder slot appears; replay button shows
*/

(() => {
  const canvas = document.getElementById('anim');
  const ctx = canvas.getContext('2d');
  const stage = document.getElementById('stage');
  const railStage = document.getElementById('railStage');
  const rightSlot = document.getElementById('rightSlot');
  const replayBtn = document.getElementById('replay');
  const headlineEl = document.getElementById('headline');

  // ----- Tweaks wiring -----
  const tweaksPanel = document.getElementById('tweaks');
  const tPalette = document.getElementById('tPalette');
  const tDensity = document.getElementById('tDensity');
  const tSpeed = document.getElementById('tSpeed');
  const tHeadline = document.getElementById('tHeadline');
  const tBg = document.getElementById('tBg');
  const tLoop = document.getElementById('tLoop');
  const tDensityV = document.getElementById('tDensityV');
  const tSpeedV = document.getElementById('tSpeedV');
  const tBgV = document.getElementById('tBgV');

  function syncTweakUI() {
    tPalette.value = TWEAKS.palette;
    tDensity.value = TWEAKS.density;
    tSpeed.value = TWEAKS.speed;
    tHeadline.value = TWEAKS.headline;
    tBg.value = TWEAKS.background;
    tLoop.checked = !!TWEAKS.loop;
    tDensityV.textContent = TWEAKS.density + ' cols';
    tSpeedV.textContent = TWEAKS.speed + 'x';
    tBgV.textContent = TWEAKS.background;
    document.documentElement.style.setProperty('--bg', TWEAKS.background);
    applyHeadline();
  }
  function applyHeadline() {
    const t = TWEAKS.headline;
    const idx = t.toLowerCase().indexOf('zeros and ones');
    if (idx >= 0) headlineEl.innerHTML = t.slice(0, idx) + '<em>' + t.substr(idx, 14) + '</em>' + t.slice(idx + 14);
    else headlineEl.textContent = t;
  }
  function persist(partial) {
    Object.assign(TWEAKS, partial);
    try { window.parent.postMessage({type:'__edit_mode_set_keys', edits:partial}, '*'); } catch(e){}
  }
  tPalette.addEventListener('change', () => { persist({palette: tPalette.value}); rebuildPortraitColors(); });
  tDensity.addEventListener('input', () => { tDensityV.textContent = tDensity.value+' cols'; persist({density:+tDensity.value}); rebuildPortraitGrid(); });
  tSpeed.addEventListener('input', () => { tSpeedV.textContent = tSpeed.value+'x'; persist({speed:+tSpeed.value}); });
  tHeadline.addEventListener('input', () => { persist({headline: tHeadline.value}); applyHeadline(); });
  tBg.addEventListener('input', () => { tBgV.textContent = tBg.value; persist({background: tBg.value}); document.documentElement.style.setProperty('--bg', tBg.value); });
  tLoop.addEventListener('change', () => { persist({loop: tLoop.checked}); });

  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode') tweaksPanel.classList.add('show');
    if (d.type === '__deactivate_edit_mode') tweaksPanel.classList.remove('show');
  });
  try { window.parent.postMessage({type:'__edit_mode_available'}, '*'); } catch(e){}
  syncTweakUI();

  // ----- Sizing -----
  let W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = stage.clientWidth; H = stage.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    rebuildPortraitGrid();
    rebuildTextLayout();
  }
  window.addEventListener('resize', resize);

  // ----- Message & binary -----
  const MESSAGE = 'We invest not in projects but in relationships';
  function toBinary(s){ let o=''; for (let i=0;i<s.length;i++) o += s.charCodeAt(i).toString(2).padStart(8,'0'); return o; }
  const MESSAGE_BITS = toBinary(MESSAGE);

  // ----- Portrait grid -----
  let GRID = null;
  let PIXELS = [];
  let PORTRAIT_BOX = null;

  fetch('assets/portrait-grid.json').then(r=>r.json()).then(async j => {
    GRID = j;
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.load('500 80px "JetBrains Mono"'); } catch(e){}
      try { await document.fonts.load('500 16px "JetBrains Mono"'); } catch(e){}
      try { await document.fonts.ready; } catch(e){}
    }
    resize();
    window.__pause = () => { paused = true; };
    window.__resume = () => { paused = false; requestAnimationFrame(frame); };
    window.__frameAt = (tSec) => { renderAt(Math.min(tSec, TOTAL)); };
    window.__PIXELS = PIXELS; window.__TWEAKS = TWEAKS;
    start();
  }).catch(err => console.error('grid load failed', err));

  // ----- Palette remap -----
  function remapColor(r,g,b,l,pal) {
    if (pal === 'full') return [r,g,b];
    if (pal === 'warm') return gradLookup(l, [[0,[22,16,12]],[0.22,[90,28,40]],[0.48,[217,74,106]],[0.7,[232,105,60]],[0.88,[242,166,90]],[1,[253,230,196]]]);
    if (pal === 'duotone') return gradLookup(l, [[0,[20,14,10]],[0.55,[217,74,106]],[1,[252,235,220]]]);
    if (pal === 'mono') return gradLookup(l, [[0,[16,10,4]],[0.55,[200,120,30]],[1,[255,220,140]]]);
    if (pal === 'cool') return gradLookup(l, [[0,[10,12,24]],[0.35,[50,60,120]],[0.65,[120,140,220]],[1,[220,230,250]]]);
    return [r,g,b];
  }
  function gradLookup(t, stops) {
    t = Math.max(0, Math.min(1, t));
    for (let i = 0; i < stops.length - 1; i++) {
      const [t0,c0] = stops[i], [t1,c1] = stops[i+1];
      if (t >= t0 && t <= t1) {
        const k = (t - t0) / (t1 - t0 || 1);
        return [Math.round(c0[0]+(c1[0]-c0[0])*k), Math.round(c0[1]+(c1[1]-c0[1])*k), Math.round(c0[2]+(c1[2]-c0[2])*k)];
      }
    }
    return stops[stops.length-1][1];
  }

  function rebuildPortraitGrid() {
    if (!GRID || !W || !H) return;
    const D = Math.max(20, Math.min(GRID.w, TWEAKS.density|0));
    const stepX = GRID.w / D;
    const aspect = GRID.h / GRID.w;
    const rows = Math.round(D * aspect);
    const stepY = GRID.h / rows;
    const targetH = H * 0.84;
    const cellH = targetH / rows;
    const cellW = cellH;
    const portraitW = cellW * D;
    const portraitH = cellH * rows;
    const pX = Math.max(48, W * 0.06);
    const pY = (H - portraitH) / 2;
    PORTRAIT_BOX = { x: pX, y: pY, w: portraitW, h: portraitH, cellW, cellH, cols: D, rows };
    PIXELS = new Array(D * rows);
    const cells = GRID.cells;
    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < D; gx++) {
        const sx = Math.min(GRID.w - 1, Math.floor(gx * stepX + stepX*0.5));
        const sy = Math.min(GRID.h - 1, Math.floor(gy * stepY + stepY*0.5));
        const [, , r, g, b, l] = cells[sy * GRID.w + sx];
        PIXELS[gy * D + gx] = {
          cx: pX + gx * cellW + cellW/2,
          cy: pY + gy * cellH + cellH/2,
          w: cellW, h: cellH,
          r, g, b, l,
        };
      }
    }
    rebuildPortraitColors();
    if (typeof window !== 'undefined') window.__PIXELS = PIXELS;
  }
  function rebuildPortraitColors() {
    if (!PIXELS.length) return;
    for (const p of PIXELS) {
      const [R,G,B] = remapColor(p.r, p.g, p.b, p.l, TWEAKS.palette);
      p.fr = R; p.fg = G; p.fb = B;
    }
  }

  // ----- Text layout: readable binary block -----
  // The layout has TWO parts that flow continuously:
  //   - Head: the first HEAD_COUNT characters, drawn in decreasing sizes
  //     (char 0 = gigantic, each subsequent one smaller), flowing left→right
  //     on one line. After the head, we break to a new line.
  //   - Body: the rest of the characters, drawn in the normal small-size
  //     monospace grid, starting right after the head break.
  //
  // HEAD_COUNT chars use these sizes (in px at 1080p); smaller viewports scale.
  let TEXT_CHARS = [];
  let TEXT_BLOCK = null;
  let HEAD_SIZES = []; // [sizeIndex0, sizeIndex1, ...]
  const HEAD_COUNT_DEFAULT = 8;

  function rebuildTextLayout() {
    if (!W || !H) return;
    const margin = Math.max(56, Math.min(W, H) * 0.06);
    const innerW = W - margin * 2;
    const innerH = H - margin * 2;

    // Small-grid (body) sizing — tight monospace
    const rowH = Math.max(14, Math.min(22, Math.round(innerH / 42)));
    const colW = rowH * 0.58;

    // Head sizes — decreasing from huge to body size.
    // Scale to viewport: biggest char ≈ 22% of viewport height.
    const big = Math.round(H * 0.22);
    const headSizes = [];
    // descending multipliers; will be lerped toward body size as index grows
    const mults = [1.00, 1.00, 0.72, 0.52, 0.38, 0.28, 0.20, 0.14];
    for (let i = 0; i < mults.length; i++) {
      const s = Math.max(rowH, Math.round(big * mults[i]));
      headSizes.push(s);
    }
    HEAD_SIZES = headSizes;

    // Place head chars left-to-right on one "line" near the top-left of the
    // content area. Use generous letter-spacing so the giant 0/1 don't collide.
    const headStartX = margin + colW * 2;
    // Baseline centerline for head: place center-of-line at ~24% down so the
    // big 0/1 sit in the upper portion and leave room for body below.
    const headCenterY = margin + headSizes[0] * 0.55;

    const headChars = [];
    let cursorX = headStartX;
    for (let i = 0; i < headSizes.length; i++) {
      const sz = headSizes[i];
      // JetBrains Mono advance ≈ 0.6 × size. For the first two chars ("0" and
      // "1"), force equal square footprint so they read as matching cells —
      // the same width/height relationship as pixels in the final portrait.
      let advance;
      if (i < 2) {
        advance = sz; // square: advance == size (equal width & height)
      } else {
        advance = sz * 0.6;
      }
      headChars.push({
        idx: i,
        x: cursorX + advance / 2,
        y: headCenterY,
        size: sz,
        bit: MESSAGE_BITS[i % MESSAGE_BITS.length],
        kind: 'head',
      });
      cursorX += advance;
    }
    const headEndX = cursorX;
    const headBottomY = headCenterY + headSizes[0] * 0.55 + rowH; // bottom of head block + breathing room

    // Body grid starts below the head block.
    const bodyTopY = Math.max(headBottomY, margin);
    const bodyBottomY = H - margin;
    const bodyH = bodyBottomY - bodyTopY;
    const cols = Math.floor(innerW / colW);
    const rows = Math.max(1, Math.floor(bodyH / rowH));
    const bodyTotal = cols * rows;
    const blockW = cols * colW;
    const bx = (W - blockW) / 2;
    const by = bodyTopY;

    TEXT_BLOCK = {
      x: bx, y: by, w: blockW, h: rows * rowH,
      cols, rows, colW, rowH,
      headCount: headSizes.length,
      bodyTotal,
      total: headSizes.length + bodyTotal,
    };

    const bodyChars = new Array(bodyTotal);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const bodyIdx = r * cols + c;
        const idx = headSizes.length + bodyIdx;
        bodyChars[bodyIdx] = {
          idx,
          x: bx + c * colW + colW/2,
          y: by + r * rowH + rowH/2,
          size: rowH,
          bit: MESSAGE_BITS[idx % MESSAGE_BITS.length],
          kind: 'body',
        };
      }
    }

    TEXT_CHARS = [...headChars, ...bodyChars];
  }

  // ----- Timeline -----
  // One continuous typing experience: the very first "0" appears, then "1",
  // then the rest of the binary message rushes in. Then zoom + portrait.
  const PHASES = [
    { k:'typing',  at:0.00, to:3.30, label:'stage · encoding' },
    { k:'zoom',    at:3.30, to:5.00, label:'stage · resolving' },
    { k:'settle',  at:5.00, to:6.00, label:'stage · settled' },
  ];
  const TOTAL = 6.0;

  // Typing curve: maps global time t ∈ [0, typingEnd] → number of chars typed.
  // We want:
  //   at t ≈ 0.30s -> 1 char (the "0")
  //   at t ≈ 0.70s -> 2 chars (the "1")
  //   at t ≈ 0.90s -> 3 chars (first bit of message body)
  //   at t = 3.30s -> ALL chars
  //
  // Piecewise: slow linear for first 2 chars, then accelerating power curve.
  function typedCharsAt(t, total) {
    const endT = PHASES[0].to; // 3.30
    if (t <= 0) return 0;
    if (t >= endT) return total;
    // Head chars appear at these times (s):
    //   0 -> 0.35   ("0" big)
    //   1 -> 0.85   ("1" big, next to 0)
    //   2 -> 1.15   (smaller)
    //   3 -> 1.38
    //   4 -> 1.55
    //   5 -> 1.70
    //   6 -> 1.82
    //   7 -> 1.92
    const headTimes = [0.35, 0.85, 1.15, 1.38, 1.55, 1.70, 1.82, 1.92];
    for (let i = 0; i < headTimes.length; i++) {
      if (t < headTimes[i]) return i;
    }
    const headLen = headTimes.length;
    // After head, body types from headLen to total between 2.0s and endT
    const bodyStart = 2.00;
    if (t < bodyStart) return headLen;
    const local = (t - bodyStart) / (endT - bodyStart);
    const curved = Math.pow(local, 1.7);
    return Math.round(headLen + (total - headLen) * curved);
  }
  let t0 = performance.now();
  let paused = false;

  function currentT(){ return ((performance.now() - t0) / 1000) * TWEAKS.speed; }
  const ease = {
    inOutCubic: t => t<0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2,
    outCubic: t => 1 - Math.pow(1-t, 3),
    outQuart: t => 1 - Math.pow(1-t, 4),
    inCubic: t => t*t*t,
  };
  function phaseProgress(name, t) {
    const p = PHASES.find(x=>x.k===name);
    if (!p) return 0;
    return Math.max(0, Math.min(1, (t - p.at) / (p.to - p.at)));
  }
  function phaseActive(t) {
    for (let i = PHASES.length-1; i >= 0; i--) if (t >= PHASES[i].at) return PHASES[i];
    return PHASES[0];
  }
  function getBg(){ return getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || TWEAKS.background; }
  function getInk(){ return '#1c140e'; }

  function clearBg(){ ctx.fillStyle = getBg(); ctx.fillRect(0,0,W,H); }

  // ----- Continuous typing + zoom-to-portrait -----
  function drawTextAndResolve(t) {
    if (!TEXT_BLOCK || !TEXT_CHARS.length) return;
    const zoomP = phaseProgress('zoom', t);
    const settleP = phaseProgress('settle', t);
    const tb = TEXT_BLOCK;

    // How many text chars typed so far — continuous curve
    const typed = Math.min(tb.total, typedCharsAt(t, tb.total));

    // --- Zoom (resolve) transform: tiny scale toward portrait ---
    const zE = ease.inOutCubic(zoomP);
    const scaleEnd = PORTRAIT_BOX ? (PORTRAIT_BOX.w / tb.w) * 0.8 : 0.3;
    const textScale = 1 + (scaleEnd - 1) * zE;
    const pbCX = PORTRAIT_BOX ? PORTRAIT_BOX.x + PORTRAIT_BOX.w/2 : W*0.3;
    const pbCY = PORTRAIT_BOX ? PORTRAIT_BOX.y + PORTRAIT_BOX.h/2 : H*0.5;
    const tbCX = tb.x + tb.w/2, tbCY = tb.y + tb.h/2;
    const tOffX = (pbCX - tbCX) * zE;
    const tOffY = (pbCY - tbCY) * zE;

    const textAlpha = zoomP === 0 ? 1 : Math.max(0, 1 - ease.inCubic(zoomP) * 1.25);
    const portraitAlpha = zoomP === 0 ? 0 : ease.inCubic(zoomP);

    // --- Draw the text ---
    if (textAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = textAlpha;
      if (zoomP > 0) {
        ctx.translate(tbCX + tOffX, tbCY + tOffY);
        ctx.scale(textScale, textScale);
        ctx.translate(-tbCX, -tbCY);
      }

      ctx.fillStyle = getInk();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const limit = Math.min(typed, tb.total);
      // Group by size for fewer font switches (head chars have unique sizes;
      // body chars all share one size — draw them last in one font-set).
      // We'll just iterate; head is small (~8) so font-switch cost is trivial.
      let curSize = -1;
      for (let i = 0; i < limit; i++) {
        const ch = TEXT_CHARS[i];
        // Fresh-typed chars: fade in + slight scale pop
        let a = 1, popScale = 1;
        const back = typed - i;
        if (back < 6 && zoomP === 0) {
          a = Math.max(0.1, back / 6);
          popScale = 0.92 + 0.08 * (back / 6);
        }
        if (ch.size !== curSize) {
          ctx.font = `500 ${ch.size}px "JetBrains Mono", ui-monospace, monospace`;
          curSize = ch.size;
        }
        if (a < 1 || popScale !== 1) {
          ctx.save();
          ctx.globalAlpha = textAlpha * a;
          if (popScale !== 1) {
            ctx.translate(ch.x, ch.y);
            ctx.scale(popScale, popScale);
            ctx.fillText(ch.bit, 0, 0);
          } else {
            ctx.fillText(ch.bit, ch.x, ch.y);
          }
          ctx.restore();
        } else {
          ctx.fillText(ch.bit, ch.x, ch.y);
        }
      }

      // Typing caret — sized/positioned based on the NEXT char to type
      if (zoomP === 0 && typed < tb.total) {
        const i = typed;
        const nextCh = TEXT_CHARS[i];
        const prevCh = i > 0 ? TEXT_CHARS[i-1] : null;
        // caret sits just-before the next char
        const caretSize = nextCh.size;
        const caretX = nextCh.x - caretSize * 0.32;
        const caretY = nextCh.y;
        const blink = (Math.floor(t*10) % 2 === 0) ? 0.85 : 0.12;
        ctx.save();
        ctx.globalAlpha = textAlpha * blink;
        ctx.fillRect(caretX - caretSize*0.04, caretY - caretSize*0.4, caretSize*0.08, caretSize*0.8);
        ctx.restore();
      }

      ctx.restore();
    }

    // --- Draw the portrait pixel grid ---
    if (portraitAlpha > 0.01 && PIXELS.length) {
      ctx.save();
      ctx.globalAlpha = portraitAlpha;
      const pScale = 1 + (1 - zE) * 0.08;
      ctx.translate(pbCX, pbCY);
      ctx.scale(pScale, pScale);
      ctx.translate(-pbCX, -pbCY);
      for (let i = 0; i < PIXELS.length; i++) {
        const p = PIXELS[i];
        ctx.fillStyle = `rgb(${p.fr},${p.fg},${p.fb})`;
        const s = Math.max(1, p.w * 0.99);
        ctx.fillRect(p.cx - s/2, p.cy - s/2, s, s);
      }
      ctx.restore();
    }
  }

  // ----- Main render -----
  function renderAt(t) {
    clearBg();
    const active = phaseActive(t);
    railStage.textContent = active.label;
    drawTextAndResolve(t);
    if (t >= 5.0) rightSlot.classList.add('show'); else rightSlot.classList.remove('show');
    if (t >= TOTAL - 0.15) replayBtn.classList.add('show'); else replayBtn.classList.remove('show');
  }

  function frame() {
    if (paused) return;
    const tRaw = currentT();
    const t = Math.min(tRaw, TOTAL);
    renderAt(t);
    if (tRaw >= TOTAL && TWEAKS.loop) t0 = performance.now();
    requestAnimationFrame(frame);
  }
  function start() {
    t0 = performance.now();
    rightSlot.classList.remove('show');
    replayBtn.classList.remove('show');
    requestAnimationFrame(frame);
  }
  replayBtn.addEventListener('click', start);
})();
