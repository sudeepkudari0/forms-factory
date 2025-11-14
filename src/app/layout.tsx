import "./globals.css";

import QueryClientWrapper from "@/components/providers/query-client-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Forms Factory",
  description:
    "Forms Factory: Revolutionize your workflow with custom, on-demand forms that integrate seamlessly into your processes",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="keywords"
          content="Instant Innovation, On-Demand Creation ,Effortless Integration"
        />
        <link rel="canonical" href="https://forms.sudeepkudari.online" />
        <link rel="canonical" href="https://sudeepkudari.online" />
      </head>
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <QueryClientWrapper>{children}</QueryClientWrapper>
          <Analytics />
          <Toaster />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
