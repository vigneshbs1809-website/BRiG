import type { Metadata } from "next";
import { Outfit, Syne, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "BrigMedia | Premium 3D Digital Agency Portfolio",
  description: "A cinematic, immersive 3D animated digital agency experience. We shape the future of brand identity, design, development, and interactive art.",
  keywords: ["digital agency", "3D portfolio", "Awwwards portfolio", "React three fiber", "GSAP scroll animations", "creative agency"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${syne.variable} ${cormorant.variable} lenis-clean`}>
      <body>
        {children}
      </body>
    </html>
  );
}
