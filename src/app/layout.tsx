import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AWS認定バッジメーカー",
  description: "AWSの認定バッジを綺麗に並べます。",
  // OGP
  openGraph: {
    title: 'AWS Certification Badge Maker',
    description: 'AWS Certification Badge Maker',
    images: [
      {
        url: '/og-image.png', // publicフォルダに配置した画像のパス
        width: 1200,
        height: 630,
        alt: 'AWS Certification Badge Maker',
      }
    ],
  },
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'AWS Certification Badge Maker',
    description: 'AWS Certification Badge Maker',
    images: ['/og-image.png'], // publicフォルダに配置した画像のパス
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
