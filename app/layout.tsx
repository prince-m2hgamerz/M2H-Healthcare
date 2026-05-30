import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Asians Healthcare - Medical Tourism in India",
    template: "%s | Asians Healthcare",
  },
  description:
    "Connect with India's top hospitals and doctors. Affordable medical treatments, world-class healthcare, and personalized care for international patients.",
  openGraph: {
    title: "Asians Healthcare - Medical Tourism in India",
    description:
      "Connect with India's top hospitals and doctors. Affordable medical treatments, world-class healthcare.",
    siteName: "Asians Healthcare",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
