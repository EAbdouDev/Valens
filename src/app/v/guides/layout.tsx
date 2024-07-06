import type { Metadata } from "next";
import { AI } from "../../../../core/action";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AI>{children}</AI>;
}
