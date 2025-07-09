"use client";

import { useEffect } from "react";

import { useMuseums } from "@/hooks/useMuseums";
import { useStories } from "@/hooks/useStories";
import { useQuery } from "@tanstack/react-query";
import MuseumDetails from "@/components/museum/MuseumDetails";
import ContactForm from "@/components/shared/ContactForm";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { Event, Museum, Timeline } from "@/types";

type MuseumProfilePageProps = {
  museumId: string;
}

export default function MuseumProfilePage({
  museumId
}: MuseumProfilePageProps) {
// const params = useParams<{ id: string }>();
// const museumId = params?.id;

  // Get museum details
  const {
    data: museum,
    isLoading: isLoadingMuseum,
    isError: isMuseumError
  } = useQuery<Museum>({
    queryKey: [`/museums/${museumId}`],
    enabled: !!museumId
  });

  // Get museum stories
  const {
    stories,
    isLoading: isLoadingStories
  } = useStories({
    museumId,
    published: true,
    approved: true,
    limit: 6
  });

  // Get events for this museum
  const {
    data: events,
    isLoading: isLoadingEvents
  } = useQuery<Event[]>({
    queryKey: [`/museums/${museumId}/events`],
    enabled: !!museumId
  });

  // Get timeline for this museum
  const {
    data: timeline,
    isLoading: isLoadingTimeline
  } = useQuery<Timeline>({
    queryKey: [`/museums/${museumId}/timeline`],
    enabled: !!museumId
  });

  // Track page view for analytics when the component mounts
  useEffect(() => {
    if (museum) {
      // This would normally make an API call to track the page view
      console.log(`Tracking museum profile view: ${museum.name}`);
    }
  }, [museum]);

  if (isLoadingMuseum) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-full h-64 mb-6" />
        <Skeleton className="w-3/4 h-10 mb-2" />
        <Skeleton className="w-1/2 h-6 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Skeleton className="w-full h-32 mb-4" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-3/4 h-4" />
          </div>
          <div>
            <Skeleton className="w-full h-32 mb-4" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-3/4 h-4" />
          </div>
        </div>
      </div>
    );
  }

  if (isMuseumError || !museum) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-destructive mb-4">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" x2="12" y1="8" y2="12"></line>
            <line x1="12" x2="12.01" y1="16" y2="16"></line>
          </svg>
          <h1 className="text-2xl font-playfair font-bold text-primary mb-2">Museum Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The museum you're looking for either doesn't exist or is not available.
          </p>
          <a href="/map" className="inline-block bg-primary text-white px-4 py-2 rounded-md font-montserrat">
            Find Other Museums
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Badge className="bg-muted text-muted-foreground font-montserrat">
          {museum.museumType.charAt(0).toUpperCase() + museum.museumType.slice(1)} Museum
        </Badge>
      </div>

      <MuseumDetails
        museum={museum}
        stories={stories || []}
        events={events ?? []}
        timeline={timeline}
      />

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-playfair font-bold text-primary mb-4">Contact the Museum</h3>
        <div className="bg-white rounded-lg border border-muted p-6">
          <ContactForm museumId={museum.id} museumName={museum.name} />
        </div>
      </div>
    </div>
  );
}
