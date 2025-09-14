import type { Metadata } from "next";
import { Michroma, Roboto } from "next/font/google";

import AppSidebar from "@/components/AppSidebar";
import Assistant from "@/components/Assistant";
import Header from "@/components/Header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AppProviders from "@/context/AppProviders";

import "./globals.css";

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
          <div className="min-h-screen bg-background">
            <Header />
            <div className="flex">
              <AppSidebar />
              <main className="flex-1 p-8">
                <SidebarTrigger />
                {children}
              </main>
            </div>
          </div>
          <Assistant />
        </AppProviders>
      </body>
    </html>
  );
}
