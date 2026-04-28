import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// ============================================
// GOOGLE SEARCH CONSOLE - VERIFIKASI
// ============================================
// Ganti kode di bawah dengan verification code dari Google Search Console
// Cara mendapatkan:
//   1. Buka https://search.google.com/search-console/
//   2. Klik "Tambah Properti" → masukkan URL web kamu
//   3. Pilih metode "Tag HTML" → copy kode meta tag
//   4. Ganti XXXXXXXXXX dengan kode yang kamu dapat
// ============================================
const GOOGLE_SITE_VERIFICATION = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DetikNews - Portal Berita Terkini",
  description: "Portal berita terkini dan terpercaya dari Indonesia. Menyajikan berita nasional, ekonomi, hiburan, olahraga, teknologi, dan internasional.",
  keywords: ["berita", "news", "indonesia", "detik", "terkini", "portal berita", "berita hari ini", "berita terbaru"],
  authors: [{ name: "DetikNews" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    title: "DetikNews - Portal Berita Terkini",
    description: "Portal berita terkini dan terpercaya dari Indonesia",
    siteName: "DetikNews",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "DetikNews - Portal Berita Terkini",
    description: "Portal berita terkini dan terpercaya dari Indonesia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-6112263998203283" />
        <link rel="canonical" href="https://detik-news2.vercel.app" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
