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
  title: "Adaptensor Beta Program — AdaptBooks, AdaptAero, AdaptVault",
  description:
    "One platform for operations, accounting, compliance, and documents. Join the Adaptensor beta testing program — AdaptBooks for POS and accounting, AdaptAero for FAA-compliant aviation MRO, and AdaptVault for secure document management.",
  openGraph: {
    title: "Adaptensor Beta Program",
    description:
      "Join the beta testing program for Adaptensor — AdaptBooks, AdaptAero, and AdaptVault. One platform, three products, zero compromise.",
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
