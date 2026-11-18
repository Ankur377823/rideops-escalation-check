import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Escalation Check",
  description: "Pre-escalation check for RideOps L1 support",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900">
        <Providers>
          <div className="lg:flex">
            <Suspense
              fallback={<div className="h-16 bg-slate-900 lg:h-screen lg:w-64 lg:shrink-0" />}
            >
              <Sidebar />
            </Suspense>
            <main className="min-w-0 flex-1">
              <Suspense fallback={<div className="hidden h-14 bg-white lg:block" />}>
                <TopBar />
              </Suspense>
              <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">{children}</div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
