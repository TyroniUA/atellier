'use client';

import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const heroLineMotion = {
  hidden: { opacity: 0, y: 56, scale: 0.88 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export function HeroScrollTunnel() {
  const reduceMotion = useReducedMotion();
  const isQuiet = reduceMotion === true;

  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end start'],
  });

  const line1Opacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const prefixOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const sidesOpacity = useTransform(scrollYProgress, [0, 0.12, 0.28], [1, 0.45, 0]);
  const oScale = useTransform(scrollYProgress, [0, 0.38, 0.88], [1, 16, 48]);
  const tunnelOpacity = useTransform(scrollYProgress, [0.12, 0.32, 0.62, 0.76], [0, 1, 1, 0]);
  const tunnelTravel = useTransform(scrollYProgress, [0.25, 0.82], [0, 1]);
  const tunnelRotate = useTransform(tunnelTravel, [0, 1], [0, 220]);
  const tunnelZoom = useTransform(tunnelTravel, [0, 1], [0.35, 1.15]);
  const portalBgOpacity = useTransform(scrollYProgress, [0.72, 0.98], [0, 1]);

  const trackClass = isQuiet
    ? 'relative mx-auto min-h-[90vh] max-w-6xl px-6'
    : 'relative mx-auto min-h-[260vh] max-w-6xl px-6 md:min-h-[320vh]';

  const stickyClass = isQuiet
    ? 'flex min-h-[90vh] flex-col items-center justify-center text-center'
    : 'sticky top-0 z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden text-center';

  return (
    <section className="relative">
      <div ref={trackRef} className={trackClass}>
        <div className={stickyClass}>
          {!isQuiet && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 bg-[#F7F5F2]"
              style={{ opacity: portalBgOpacity }}
            />
          )}

          {!isQuiet && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden"
              style={{ opacity: tunnelOpacity }}
            >
              <motion.div
                className="aspect-square h-[min(220vmin,1400px)] w-[min(220vmin,1400px)] rounded-full"
                style={{
                  rotate: tunnelRotate,
                  scale: tunnelZoom,
                  background:
                    'repeating-conic-gradient(from 0deg, #0f3d28 0deg 6deg, #1f6b45 6deg 12deg, #0a2a1c 12deg 18deg)',
                  boxShadow:
                    'inset 0 0 120px rgba(0,0,0,0.55), inset 0 0 40px rgba(247,245,242,0.12), 0 0 80px rgba(0,0,0,0.35)',
                }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, transparent 0%, transparent 18%, rgba(0,0,0,0.2) 42%, rgba(0,0,0,0.65) 100%)',
                }}
              />
            </motion.div>
          )}

          <motion.div
            initial={false}
            className="relative z-[2] w-full md:w-[68vw] md:max-w-none"
          >
            <h1 className="flex flex-col items-center text-[clamp(2.5rem,5.1vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-balance">
              <motion.span
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={heroLineMotion}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                className="hero-type-row"
                style={isQuiet ? undefined : { opacity: line1Opacity }}
              >
                <span className="type-line type-line-first">
                  <span className="type-line-text">
                    <span>We don’t take </span>
                    <span className="text-[0.94em] text-[#C9772B]">clients.</span>
                  </span>
                </span>
              </motion.span>
              <motion.span
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={heroLineMotion}
                transition={{ duration: 2, delay: 2, ease: [0.22, 1, 0.36, 1] }}
                className="hero-type-row mt-2 md:mt-3"
              >
                <span className="type-line type-line-second">
                  <span className="type-line-text">
                    <motion.span className="inline" style={isQuiet ? undefined : { opacity: prefixOpacity }}>
                      <span>We take </span>
                    </motion.span>
                    <span className="inline-block text-[1.02em] uppercase tracking-[0.02em] text-[#2E8B57]">
                      <motion.span className="inline" style={isQuiet ? undefined : { opacity: sidesOpacity }}>
                        resp
                      </motion.span>
                      <motion.span
                        className="relative inline-block will-change-transform"
                        style={
                          isQuiet
                            ? undefined
                            : {
                                scale: oScale,
                                transformOrigin: '50% 55%',
                              }
                        }
                      >
                        {!isQuiet && (
                          <motion.span
                            aria-hidden
                            className="pointer-events-none absolute left-1/2 top-1/2 z-0 block h-[1.15em] w-[1.05em] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[length:200%_200%]"
                            style={{
                              opacity: tunnelOpacity,
                              backgroundImage:
                                'repeating-conic-gradient(from 0deg, #0f3d28 0deg 6deg, #1f6b45 6deg 12deg, #0a2a1c 12deg 18deg)',
                              boxShadow: 'inset 0 0 0.35em rgba(0,0,0,0.45)',
                            }}
                          />
                        )}
                        <span className="relative z-[1] inline-block text-[#2E8B57] drop-shadow-[0_0.08em_0_rgba(10,42,28,0.25)]">
                          o
                        </span>
                      </motion.span>
                      <motion.span className="inline" style={isQuiet ? undefined : { opacity: sidesOpacity }}>
                        nsibility.
                      </motion.span>
                    </span>
                  </span>
                </span>
              </motion.span>
            </h1>

            <motion.p
              className="mt-8 text-lg text-[#6B6B6B]"
              style={isQuiet ? undefined : { opacity: subtitleOpacity }}
            >
              Every engagement is a long-term commitment — to your goals, your people, and your future.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
