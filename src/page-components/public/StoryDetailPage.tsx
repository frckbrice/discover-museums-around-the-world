"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMuseums } from "@/hooks/useMuseums";
import { format } from "date-fns";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Story } from "@/types";

type MuseumProfilePageProps = {
  storyId: string;
}


export default function StoryDetailPage({
  storyId
}: MuseumProfilePageProps) {

  // Fetch the story data directly with custom query function
  const {
    data: story,
    isLoading,
    isError,
  } = useQuery<Story | any>({
    queryKey: [`/stories/${storyId}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get museum data for the story
  const { museums } = useMuseums({
    approved: true
  });

  const museum = story?.museumId ? museums?.find(m => m.id === story.museumId) : null;

  // Parse published date
  const publishedDate = story?.publishedAt ? new Date(story.publishedAt) : null;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-6" />
          <Skeleton className="h-96 w-full mb-8 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Story Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the story you're looking for. It may have been removed or the URL might be incorrect.
          </p>
          <Link href="/stories">
            <Button>Browse All Stories</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Story Header */}
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-3">
          {story?.title}
        </h1>

        {/* Museum & Date Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {museum && (
              <Link href={`/museums/${museum.id}`}>
                <div className="flex items-center text-muted-foreground hover:text-foreground cursor-pointer">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={museum.logoUrl || ''} alt={museum.name} />
                    <AvatarFallback>{museum.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span>{museum.name}</span>
                </div>
              </Link>
            )}
          </div>

          {publishedDate && (
            <div className="text-sm text-muted-foreground">
              Published on {format(publishedDate, 'MMMM d, yyyy')}
            </div>
          )}
        </div>

        {/* Featured Image */}
        {story?.featuredImageUrl && (
          <div className="mb-8">
            <img
              src={story.featuredImageUrl}
              alt={story.title}
              className="w-full h-auto rounded-lg object-cover shadow-md"
              style={{ maxHeight: '500px' }}
            />
          </div>
        )}

        {/* Story Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-lg mb-4 text-muted-foreground font-medium">
            {story?.summary}
          </div>
          <div className="mt-6" dangerouslySetInnerHTML={{ __html: story?.content || '' }} />
        </div>

        {/* Tags */}
        {story?.tags && story.tags.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm text-muted-foreground mb-2">Related topics:</h3>
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag: string) => (
                <Link key={tag} href={`/stories?tag=${tag}`}>
                  <div className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white transition-colors cursor-pointer">
                    {tag}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <Link href="/stories">
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6"></path></svg>
              Back to Stories
            </Button>
          </Link>

          {museum && (
            <Link href={`/museums/${museum.id}`}>
              <Button variant="outline">
                Visit {museum.name}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="m9 18 6-6-6-6"></path></svg>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}