import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GAP-IT | Quality Operations",
  description: "Quality operations workspace for measurement and process control.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
