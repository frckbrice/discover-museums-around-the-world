import StoriesPage from "@/page-components/public/StoriesPage";
import React from "react";

export const metadata = {
  title: "Museum Stories - Discover Cultural Heritage and Hidden Histories",
  description:
    "Explore captivating stories from museums around the world. Dive into cultural heritage, discover hidden histories, and get inspired by curated narratives.",
  keywords: [
    "museum stories",
    "cultural heritage",
    "history articles",
    "museum narratives",
    "educational stories",
    "historical exhibits",
    "featured museum stories",
    "cultural exploration",
    "museum blogs",
    "heritage storytelling",
  ],
  openGraph: {
    title: "Museum Stories - Discover Cultural Heritage and Hidden Histories",
    description:
      "Journey through time with stories that unveil the mysteries and marvels of our shared history.",
    url: "https://museumcall.com/stories",
    siteName: "MuseumCall",
    images: [
      {
        url: "https://museumcall.com/images/photorealistic-refugee-camp.jpg",
        width: 1200,
        height: 630,
        alt: "Museum Stories and Cultural Heritage",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Museum Stories - Discover Cultural Heritage and Hidden Histories",
    description: "Explore captivating stories from museums around the world.",
    images: ["https://museumcall.com/images/photorealistic-refugee-camp.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://museumcall.com/stories",
  },
};

export default function StoryPage() {
  return <StoriesPage />;
}
