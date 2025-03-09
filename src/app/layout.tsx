// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LenisWrapper from '@/components/LenisWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js + Lenis',
  description: 'Ultra-smooth scrolling with Lenis in Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LenisWrapper>{children}</LenisWrapper>
      </body>
    </html>
  );
}