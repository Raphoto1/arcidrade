//app imports
import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Condensed, Oswald } from "next/font/google";
import "./globals.css";
//project imports
import NavBar from "@/components/nav/NavBar";

const robotoCond = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Arcidrade",
  description: "Plataforma para conectar instituciones sanitarias y profesionales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <body className={`${robotoCond.variable} ${oswald.variable} antialiased`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
