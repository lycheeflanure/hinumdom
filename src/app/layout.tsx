import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import React, { Suspense } from "react";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AdminAuthProvider } from "@/lib/adminAuthContext";
import { ThemeProvider } from "@/lib/themeContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HINUMDOM",
  description: "Find the final resting place of your loved ones.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('hinumdom-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light');document.documentElement.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
          <LanguageProvider>
            <AdminAuthProvider>
              <Suspense fallback={<div className="h-20" />}>
                <Header />
              </Suspense>
              <main className="flex-grow flex flex-col">{children}</main>
              <Footer />
            </AdminAuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
