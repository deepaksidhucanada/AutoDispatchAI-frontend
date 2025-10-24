// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const TITLE = "AutoDispatchAI — AI Dispatch Automation for Trucking Fleets";
const DESC =
  "Run your trucking fleet 24/7. AutoDispatchAI finds loads, negotiates, matches drivers, and updates ops — with a human-in-the-loop.";

export const metadata: Metadata = {
  metadataBase: new URL("https://autodispatchai.com"),
  title: { default: TITLE, template: "%s | AutoDispatchAI" },
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://autodispatchai.com/",
    siteName: "AutoDispatchAI",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "AutoDispatchAI" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: "/logo.png",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#111827" }],
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-white text-neutral-900`}>
        {children}
      </body>
    </html>
  );
}

