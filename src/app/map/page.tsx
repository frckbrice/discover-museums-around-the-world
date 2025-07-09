import MapPage from "@/page-components/public/MapPage";
import React from "react";

export const metadata = {
  title: "Interactive Museum Map | Discover Museums Worldwide | MuseumCall",
  description:
    "Explore and search museums around the globe using our interactive map. Filter by type, location, and discover cultural treasures with MuseumCall.",
  keywords: [
    "Museum Map",
    "Interactive Museum Explorer",
    "Find Museums",
    "Discover Museums Worldwide",
    "Cultural Heritage",
    "Search Museums",
    "MuseumCall",
  ],
  authors: [{ name: "MuseumCall Team", url: "https://museumcall.com" }],
  openGraph: {
    title: "Interactive Museum Map | MuseumCall",
    description:
      "Use our interactive world map to find museums by country, city, or category. Start exploring cultural heritage today.",
    url: "https://museumcall.com/map",
    siteName: "MuseumCall",
    images: [
      {
        url: "https://museumcall.com/images/photorealistic-refugee-camp.jpg", // make sure this exists
        width: 1200,
        height: 630,
        alt: "MuseumCall Interactive Map",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Museums with the Interactive Map | MuseumCall",
    description:
      "Find and discover museums worldwide with our interactive search map.",
    images: ["https://museumcall.com/images/photorealistic-refugee-camp.jpg"],
    site: "@museumcall",
  },
  metadataBase: new URL("https://museumcall.com"),
};

export default function MapIndexPage() {
  return <MapPage />;
}
