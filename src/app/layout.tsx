import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import RootLayout from "@/components/layout/RootLayout";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/components/providers/QueryProvider";

import "./globals.css";
/* Import fonts */
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/400-italic.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://museumcall.com"),
  title: {
    default: "MuseumHubs - Explore the World's Cultural Heritage",
    template: "%s | MuseumHubs"
  },
  description: "Immerse yourself in stories and artifacts from museums across the globe. Discover exceptional collections and immersive experiences from South Africa, Cameroon, Nigeria, Egypt, and beyond.",
  keywords: [
    "museums",
    "cultural heritage",
    "African museums",
    "museum stories",
    "cultural artifacts",
    "historical museums",
    "museum exploration",
    "cultural tourism",
    "heritage sites",
    "museum collections",
    "South Africa museums",
    "Cameroon museums",
    "Nigeria museums",
    "Egypt museums",
    "interactive museum map"
  ],
  authors: [
    { name: "MuseumHubs Team", url: "https://museumcall.com" }
  ],
  creator: "MuseumHubs",
  publisher: "MuseumHubs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://museumcall.com",
    siteName: "MuseumHubs",
    title: "MuseumHubs - Explore the World's Cultural Heritage",
    description: "Immerse yourself in stories and artifacts from museums across the globe. Discover exceptional collections and immersive experiences from South Africa, Cameroon, Nigeria, Egypt, and beyond.",
    images: [
      {
        url: "https://museumcall.com/images/museum-hero-new.jpg",
        width: 1200,
        height: 630,
        alt: "MuseumHubs - Explore the World's Cultural Heritage",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@museumhubs",
    creator: "@museumhubs",
    title: "MuseumHubs - Explore the World's Cultural Heritage",
    description: "Immerse yourself in stories and artifacts from museums across the globe. Discover exceptional collections and immersive experiences from South Africa, Cameroon, Nigeria, Egypt, and beyond.",
    images: ["https://museumcall.com/images/museum-hero-new.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://museumcall.com",
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayoutPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo-museum.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo-museum.jpg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider>
              <RootLayout>
                <main id="main-content" role="main">
                  {children}
                </main>
                <Toaster
                  richColors
                  theme="light"
                  closeButton
                  position="top-right"
                />
              </RootLayout>
            </TooltipProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
