import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import SplashCursor from "@/components/SplashCursor";

export const metadata: Metadata = {
  title: "Octipai - Synesthetic Meaning Translation",
  description: "Experience McKenna's octopus vision - translating meaning beyond language through AI-powered consciousness expansion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        <SplashCursor />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
