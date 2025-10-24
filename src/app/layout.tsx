// app/layout.tsx
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" })

const TITLE = "AutoDispatchAI — AI Dispatch Automation for Trucking Fleets"
const DESC =
  "Run your trucking fleet 24/7. AutoDispatchAI finds loads, negotiates, matches drivers, and updates ops — with a human-in-the-loop."

export const metadata: Metadata = {
  // Change to your real prod domain when ready (ok to keep during local)
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

  // Using only what you have in /public right now:
  // - icon (SVG) → modern browsers
  // - apple (PNG) → iOS Home Screen
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: "/logo.png",
  },

  alternates: { canonical: "/" },
}

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#111827" }],
  colorScheme: "light",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-neutral-900`}>
        {children}
      </body>
    </html>
  )
}
