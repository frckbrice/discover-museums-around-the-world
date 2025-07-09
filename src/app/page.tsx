import type { Metadata } from 'next';
import HomePage from "@/page-components/public/HomePage";
import { WebsiteStructuredData, OrganizationStructuredData } from "@/components/shared/StructuredData";
import PerformanceMonitor from "@/components/shared/PerformanceMonitor";
import AccessibilityWrapper from "@/components/shared/AccessibilityWrapper";

export const metadata: Metadata = {
  title: "Explore the World's Cultural Heritage | MuseumHubs.com",
  description:
    "Immerse yourself in stories and artifacts from museums across the globe. Discover exceptional collections and immersive experiences from South Africa, Cameroon, Nigeria, Egypt, and beyond.",
  keywords: [
    "Museums",
    "Cultural Heritage",
    "Museum Stories",
    "Explore Museums",
    "African Museums",
    "Historical Museums",
    "MuseumHubs",
    "Cultural Tourism",
    "Heritage Sites",
    "Museum Collections",
    "South Africa Museums",
    "Cameroon Museums",
    "Nigeria Museums",
    "Egypt Museums",
    "Interactive Museum Map"
  ],
  authors: [{ name: "MuseumHubs Team", url: "https://museumcall.com" }],
  openGraph: {
    title: "Explore the World's Cultural Heritage | MuseumHubs.com",
    description:
      "Immerse yourself in stories and artifacts from museums across the globe. Discover exceptional collections and immersive experiences from South Africa, Cameroon, Nigeria, Egypt, and beyond.",
    url: "https://museumcall.com",
    siteName: "MuseumHubs",
    images: [
      {
        url: "https://museumcall.com/images/museum-hero-new.jpg",
        width: 1200,
        height: 630,
        alt: "MuseumHubs - Explore the World's Cultural Heritage",
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore the World's Cultural Heritage | MuseumHubs.com",
    description:
      "Immerse yourself in stories and artifacts from museums across the globe. Discover exceptional collections and immersive experiences from South Africa, Cameroon, Nigeria, Egypt, and beyond.",
    images: ["https://museumcall.com/images/museum-hero-new.jpg"],
    site: "@museumhubs",
    creator: "@museumhubs",
  },
  alternates: {
    canonical: "https://museumcall.com",
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
};

export default function Home() {
  return (
    <>
      {/* Structured Data for SEO */}
      <WebsiteStructuredData />
      <OrganizationStructuredData />

      {/* Performance Monitoring */}
      <PerformanceMonitor />

      {/* Accessibility Wrapper */}
      <AccessibilityWrapper>
        <HomePage />
      </AccessibilityWrapper>
    </>
  );
}
