import ContactPage from "@/page-components/public/ContactPage";
import React from "react";

// app/contact/page.tsx (server component version)

export const metadata = {
  title: "Contact Museums | MuseumCall",
  description:
    "Reach out to museums directly or contact the MuseumCall team for inquiries, partnerships, or support. Select your preferred museum to get started.",
  keywords: [
    "Museum contact",
    "MuseumCall",
    "Contact museums",
    "Museum partnerships",
    "Museum support",
    "Cultural institutions",
    "Connect with museums",
  ],
  authors: [{ name: "MuseumCall Team", url: "https://museumcall.com" }],
  openGraph: {
    title: "Contact Museums | MuseumCall",
    description:
      "Have questions or need support? Contact our partner museums or the MuseumCall support team directly.",
    url: "https://museumcall.com/contact",
    siteName: "MuseumCall",
    images: [
      {
        url: "https://museumcall.com/images/photorealistic-refugee-camp.jpg", // Replace with actual image
        width: 1200,
        height: 630,
        alt: "Contact MuseumCall",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Museums | MuseumCall",
    description:
      "Reach out to MuseumCall or connect directly with featured museums across the globe.",
    images: ["https://museumcall.com/images/photorealistic-refugee-camp.jpg"],
    site: "@museumcall",
  },
  metadataBase: new URL("https://museumcall.com"),
};

export default function IndexPage() {
  return <ContactPage />;
}
