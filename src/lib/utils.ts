import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { Museum } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null, formatStr: string = "MMMM d, yyyy"): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, formatStr);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export const museumTypes = [
  { value: "art", label: "Art" },
  { value: "history", label: "History" },
  { value: "science", label: "Science" },
  { value: "natural_history", label: "Natural History" },
  { value: "technology", label: "Technology" },
  { value: "cultural", label: "Cultural" },
  { value: "specialized", label: "Specialized" },
];

export const mediaTypes = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "audio", label: "Audio" },
  { value: "document", label: "Document" },
  { value: "3d", label: "3D Model" },
];

// Function to generate placeholder image URLs based on width and height
export function getPlaceholderImage(width: number, height: number, text?: string): string {
  const placeholder = `https://placehold.co/${width}x${height}`;
  return text ? `${placeholder}?text=${encodeURIComponent(text)}` : placeholder;
}

export function createMuseumSubdomain(museum: Museum) {
  const cleanName = museum.name
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '');    // Remove special characters

  const museumUrl = `${window.location.protocol}//${cleanName}.${window.location.host}`;

  console.log(`Original: "${museum.name}"`);
  console.log(`Cleaned: "${cleanName}"`);
  console.log(`URL: ${museumUrl}`);

  return museumUrl;
}
