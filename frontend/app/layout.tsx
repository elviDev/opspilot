import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpsPilot — AI Monitoring Dashboard",
  description: "Real-time uptime monitoring with AI-generated incident explanations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-white antialiased">{children}</body>
    </html>
  );
}
