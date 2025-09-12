import type { Metadata } from "next";
import { Michroma, Roboto } from "next/font/google";
import "./globals.css";

import Assistant from "@/components/Assistant";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AppProviders from "@/context/AppProviders";

const michroma = Michroma({
  variable: "--font-michroma",
  weight: "400",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RED OCEAN - Accounting Suite",
  description: "Comprehensive accounting suite for small businesses.",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${michroma.variable} ${roboto.variable} antialiased`}>
        <AppProviders>
          <div>
            <div className="min-h-screen bg-background">
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">{children}</main>
              </div>
            </div>
            <Assistant />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
