//app imports
import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Condensed, Oswald } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
//project imports
import NavBar from "@/components/nav/NavBar";
import Footer from "@/components/pieces/Footer";
import GlobalContext from "@/context/GlobalContext";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { defaultMetadata, organizationStructuredData, websiteStructuredData } from "@/config/metadata";
import CookieBanner from "@/components/CookieBanner";

const robotoCond = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <head>
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      </head>
      <body className={`${robotoCond.variable} ${oswald.variable} antialiased`}>
        <GlobalContext>
          <NavBar />
          {children}
          <SpeedInsights />
          <Analytics />
          <Footer />
          <CookieBanner />
        </GlobalContext>
      </body>
    </html>
  );
}
