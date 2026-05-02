import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// Google Search Console Verification Code
const GOOGLE_SITE_VERIFICATION = "google82271afd81b42e09.html";

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
  verification: {
    google: 'google82271afd81b42e09.html',
  },
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
        <script src="https://pl29322274.profitablecpmratenetwork.com/8b/38/fb/8b38fb8f148777ea9ae4d4c6bc484491.js"></script>
      </body>
    </html>
  );
}
