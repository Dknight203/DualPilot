import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/app/components/Footer";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DualPilot - Rank on Google. Show up in AI.",
  description: "DualPilot is an automated AI plus Search visibility engine that audits pages, generates AI ready metadata and schema, and keeps sites visible across classic search and AI assistants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F8FAFC] text-[#1E1E1E]`}>
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
