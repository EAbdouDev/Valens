import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import NextThemeProvider from "@/providers/NextThemeProvider";
import UIProvider from "../providers/UIProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
      <body className={poppins.className}>
        <AuthProvider>
          <UIProvider>
            <NextThemeProvider>{children}</NextThemeProvider>
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
