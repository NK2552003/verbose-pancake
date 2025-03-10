import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LenisWrapper from '@/components/LenisWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Nitish's Portfolio",
  description:
    "Explore Nitish's Portfolio, a creative space where you can discover his projects, blogs, tech insights, and more. Dive into his world of innovation and development.",
  keywords: [
    "Nitish",
    "personal website",
    "portfolio",
    "projects",
    "blog",
    "tech",
    "developer",
    "programming",
    "web development",
    "software",
  ],
  authors: [{ name: "Nitish Kumar" }],
  robots: "index, follow",
  openGraph: {
    title: "Nitish's Portfolio",
    description:
      "Explore Nitish's Portfolio, a creative space where you can discover his projects, blogs, tech insights, and more. Dive into his world of innovation and development.",
    images: "./logo.png",
    url: "https://www.nitish.fun",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nitish's Portfolio",
    description:
      "Explore Nitish's Portfolio, a creative space where you can discover his projects, blogs, tech insights, and more. Dive into his world of innovation and development.",
    images: "./logo.png",
    site: "https://www.nitish.fun",
  },
  other: {
    "linkedin:title": "Nitish's Portfolio",
    "linkedin:description":
      "Explore Nitish's Portfolio, a creative space where you can discover his projects, blogs, tech insights, and more. Dive into his world of innovation and development.",
    "linkedin:image": "./logo.png",
    "pinterest:title": "Nitish's Portfolio",
    "pinterest:description":
      "Explore Nitish's Portfolio, a creative space where you can discover his projects, blogs, tech insights, and more. Dive into his world of innovation and development.",
    "pinterest:image": "./logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <LenisWrapper>{children}</LenisWrapper>
      </body>
    </html>
  );
}
