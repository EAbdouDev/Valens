import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import NextThemeProvider from "@/providers/NextThemeProvider";
import UIProvider from "../providers/UIProvider";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

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
            <NextThemeProvider>
              <NextTopLoader
                color={"#4848cd"}
                initialPosition={0.08}
                crawlSpeed={200}
                showSpinner={false}
                height={3}
                crawl={true}
                easing="ease-in-out"
                speed={200}
                shadow="0 0 10px #ffff,0 0 5px #ffffD"
                zIndex={1600}
              />
              {children}
            </NextThemeProvider>
            <Toaster />
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
