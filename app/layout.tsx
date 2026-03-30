import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "e-RINDE — Early Health Risk Awareness",
  description: "Early health risk awareness for underserved communities in Africa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
