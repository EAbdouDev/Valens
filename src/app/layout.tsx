import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import NextThemeProvider from "@/providers/NextThemeProvider";
import UIProvider from "../providers/UIProvider";
import { Toaster } from "@/components/ui/sonner";

const font = Public_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Valens ",
    default: "Valens ",
  },
  description: "An assistant to help medical studnets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className} suppressHydrationWarning>
        <AuthProvider>
          <UIProvider>
            <NextThemeProvider>{children}</NextThemeProvider>
            <Toaster />
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
