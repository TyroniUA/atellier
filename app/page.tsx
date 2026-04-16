'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HeroScrollTunnel } from '@/components/hero-scroll-tunnel';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function BoutiqueAgencyLanding() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F5F2] text-[#1C1C1C] selection:bg-[#C6A87D] selection:text-white">
      <header className="fixed top-0 z-50 w-full border-b border-[#E7E3DD] bg-[#F7F5F2]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="text-lg font-semibold tracking-tight">Atelier</div>
          <nav className="hidden gap-10 text-sm text-[#6B6B6B] md:flex">
            <a href="#work">Work</a>
            <a href="#approach">Approach</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main className="pt-32">
        <HeroScrollTunnel />

        <section id="principles" className="mx-auto mt-12 max-w-5xl scroll-mt-28 px-6 text-center md:mt-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl font-semibold sm:text-4xl">Our principles</h2>
            <p className="mx-auto mt-6 max-w-2xl text-[#6B6B6B]">
              We listen carefully, communicate transparently, and build trust through equal, mutually respectful relationships.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'We listen first',
                text: 'Understanding your problem deeply is the foundation of everything we build.',
              },
              {
                title: 'Transparent communication',
                text: 'Clear, direct, and honest dialogue at every stage. No surprises.',
              },
              {
                title: 'Trust as a practice',
                text: 'We aim to build relationships based on mutual respect and long-term alignment.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-[1.75rem] border border-[#E5DED6] bg-white p-7"
              >
                <div className="text-lg font-medium">{item.title}</div>
                <p className="mt-3 text-sm text-[#6B6B6B]">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="proof" className="mx-auto mt-32 max-w-5xl px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl">Long-term relationships</h2>
            <p className="mx-auto mt-6 max-w-2xl text-[#6B6B6B]">
              We measure success by continuity, trust, and outcomes over time — not short-term delivery.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { value: '3+ yrs', label: 'average client relationship' },
              { value: '9.6/10', label: 'client satisfaction score' },
              { value: '85%', label: 'repeat engagements' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-[1.75rem] border border-[#E5DED6] bg-white p-8 text-center"
              >
                <div className="text-3xl font-semibold">{stat.value}</div>
                <div className="mt-2 text-sm text-[#6B6B6B]">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                quote: 'They operate like an internal team. High ownership, clear thinking, no noise.',
                author: 'Head of Engineering, EU Programme',
              },
              {
                quote: 'We trust them with critical systems. The relationship is as valuable as the delivery.',
                author: 'CTO, Benelux Enterprise',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-[1.75rem] border border-[#E5DED6] bg-white p-7"
              >
                <p className="leading-relaxed text-[#1C1C1C]">“{item.quote}”</p>
                <div className="mt-4 text-sm text-[#9C8B76]">{item.author}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="approach" className="mx-auto mt-32 max-w-5xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Long-term thinking',
                text: 'We design systems that remain stable and understandable years later.',
              },
              {
                title: 'Direct collaboration',
                text: 'You work directly with engineers. No layers, no translation loss.',
              },
              {
                title: 'Trust by default',
                text: 'Transparent decisions, full ownership, and no surprises.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-[1.75rem] border border-[#E5DED6] bg-white p-7"
              >
                <div className="text-lg font-medium">{item.title}</div>
                <p className="mt-3 text-sm text-[#6B6B6B]">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="process" className="mx-auto mt-32 max-w-5xl px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl">Our process</h2>
            <p className="mx-auto mt-6 max-w-2xl text-[#6B6B6B]">
              Clear, structured, and built around understanding before execution.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-5">
            {[
              'You have an idea or a problem',
              'You contact us',
              'We listen and understand',
              'We define and build together',
              'We deliver and continue',
            ].map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-[1.75rem] border border-[#E5DED6] bg-white p-6 text-center"
              >
                <div className="text-sm text-[#9C8B76]">0{index + 1}</div>
                <div className="mt-3 text-sm leading-relaxed text-[#1C1C1C]">{step}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact" className="mx-auto mt-32 max-w-3xl px-6 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-[#E5DED6] bg-white px-8 py-12"
          >
            <h2 className="text-3xl font-semibold sm:text-4xl">Let’s build something that lasts.</h2>
            <p className="mt-4 text-[#6B6B6B]">
              If trust, clarity, and long-term thinking matter — we should talk.
            </p>

            <div className="mt-10">
              <Button className="rounded-full bg-[#C6A87D] px-8 py-6 text-base text-white hover:bg-[#B89666]">
                Start a conversation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-[#E5DED6]">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-[#9C8B76]">© 2026 Atelier</div>
      </footer>
    </div>
  );
}
