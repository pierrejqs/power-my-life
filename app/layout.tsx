import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://power-my-life.vercel.app"),
  title: "Power My Life",
  description: "Rends ta maison energetiquement autonome en 7 jours",
  openGraph: {
    title: "Power My Life",
    description: "Rends ta maison energetiquement autonome en 7 jours",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
