import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monitoreo de buses",
  description: "Dashboard de monitoreo de buses en tiempo real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
