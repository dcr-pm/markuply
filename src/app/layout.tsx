import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Markuply — Sketch to Email HTML Builder",
  description:
    "Design emails by sketching or drag-and-drop. Convert whiteboard drawings into production-ready HTML email blocks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
