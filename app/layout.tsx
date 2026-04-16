import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atelier — Checkpoint One',
  description: 'Boutique agency landing page checkpoint focused on trust, responsibility, and long-term relationships.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
