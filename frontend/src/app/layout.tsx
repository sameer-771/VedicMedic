import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VedicMedic – Ayurvedic Diet & Practice Management",
  description: "A cloud-based healthcare platform for Ayurvedic dietitians to manage patients, generate personalized diet plans, track nutrition, and schedule appointments.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
