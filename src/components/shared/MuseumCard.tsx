
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Museum } from "@/types/Museum";
import Link from "next/link";

interface MuseumCardProps {
  museum: Museum;
  featured?: boolean;
}

export default function MuseumCard({
  museum,
  featured = false,
}: MuseumCardProps) {
  return (
    <Card className="bg-white rounded-md overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
  <img
    src={museum.featuredImageUrl || "https://placehold.co/800x500?text=Museum+Image"}
    alt={museum.name}
    className="w-full h-60 object-cover rounded-t-md"
  />
  <CardContent className="p-6">
    {featured && (
      <Badge className="bg-destructive text-white text-xs px-3 py-1 rounded-full font-montserrat uppercase">
        Featured
      </Badge>
    )}
    <h3 className="mt-3 text-2xl font-playfair font-bold text-primary leading-snug">
      {museum.name}
    </h3>
    <p className="mt-2 text-muted-foreground text-sm line-clamp-3 font-inter">
      {museum.description}
    </p>
    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-destructive"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      <span className="font-montserrat">
        {museum.city}, {museum.country}
      </span>
    </div>
    <div className="mt-6">
      <Link href={`/museums/${museum.id}`}>
        <Button
          variant="outline"
          className="border-primary text-primary font-montserrat rounded hover:bg-primary hover:text-white transition"
        >
          View Profile
        </Button>
      </Link>
    </div>
  </CardContent>
</Card>

  );
}
