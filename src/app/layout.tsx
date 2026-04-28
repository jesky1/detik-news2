import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
  description: "Portal berita terkini dan terpercaya dari Indonesia",
  keywords: ["berita", "news", "indonesia", "detik", "terkini", "portal berita"],
  authors: [{ name: "DetikNews" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "DetikNews - Portal Berita Terkini",
    description: "Portal berita terkini dan terpercaya dari Indonesia",
    siteName: "DetikNews",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DetikNews - Portal Berita Terkini",
    description: "Portal berita terkini dan terpercaya dari Indonesia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
