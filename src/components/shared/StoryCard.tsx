
import { formatDate, truncateText } from "@/lib/utils";
import { Story } from "@/types/Story";
import { Museum } from "@/types/Museum";
import Link from "next/link";

interface StoryCardProps {
  story: Story;
  museum?: Museum;
  featured?: boolean;
}

export default function StoryCard({ story, museum, featured = false }: StoryCardProps) {
  return (
    <div className={`rounded-lg overflow-hidden shadow-md ${featured ? 'bg-neutral-offwhite' : 'bg-white'}`}>
      {featured && (
        <img 
          src={story.featuredImageUrl || "https://placehold.co/1200x600?text=Story+Image"} 
          alt={story.title} 
          className="w-full h-64 object-cover"
        />
      )}
      <div className="p-6">
        {museum && (
          <div className="flex items-center mb-4">
            <img 
              src={museum.logoUrl || "https://placehold.co/80x80?text=Museum+Logo"} 
              alt={museum.name} 
              className="w-10 h-10 rounded-full object-cover" 
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-primary">{museum.name}</p>
              <p className="text-xs text-muted-foreground">
                Published {formatDate(story.publishedAt || story.createdAt)}
              </p>
            </div>
          </div>
        )}
        
        <h3 className="text-xl md:text-2xl font-playfair font-bold text-primary">
          {story.title}
        </h3>
        
        <p className="mt-3 text-muted-foreground">
          {truncateText(story.summary, featured ? 150 : 100)}
        </p>
        
        <Link href={`/stories/${story.id}`} >
          <span className="mt-4 inline-block text-destructive font-montserrat font-medium hover:underline">
            Read Full Story 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 inline-block">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
