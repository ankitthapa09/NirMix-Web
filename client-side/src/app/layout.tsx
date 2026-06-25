import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

// Loading Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Nirmix", template: "%s | Nirmix" },
  description: "Nepal property and construction platform.",
  metadataBase: new URL("https://nirmix.com.np"),
  openGraph: {
    siteName: "Nirmix",
    locale: "en_NP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="ne"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-ink bg-sand">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
