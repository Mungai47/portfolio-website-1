import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Still / Light — Photography",
  description: "Honest photographs for the things worth remembering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
