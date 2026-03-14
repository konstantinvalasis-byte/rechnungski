import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RechnungsKI – Rechnungen in 2 Minuten",
  description: "KI-Rechnungssoftware für Dienstleister, Handwerker und Freelancer. §14-konform, PDF-Export, DATEV-ready.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
