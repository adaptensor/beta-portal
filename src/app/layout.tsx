import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AdaptAero Beta Program | Adaptensor",
  description:
    "Shape the future of aviation MRO software. Join the AdaptAero beta testing program — the only affordable, FAA-compliant MRO + accounting platform built for repair stations.",
  openGraph: {
    title: "AdaptAero Beta Program",
    description:
      "Join the beta testing program for AdaptAero — aviation MRO cloud platform by Adaptensor.",
    type: "website",
    url: "https://beta.adaptensor.io",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
        <body className="font-sans antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
