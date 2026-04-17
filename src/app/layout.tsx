import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat App - Real-time Messaging",
  description: "WhatsApp-style real-time chat application built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        {children}
      </body>
    </html>
  );
}
