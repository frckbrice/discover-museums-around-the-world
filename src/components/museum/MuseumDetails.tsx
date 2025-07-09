import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Museum, Story, Event, MediaItem } from "@/types";
import { createMuseumSubdomain, formatDate } from "@/lib/utils";
import TimelineDisplay from "../shared/TimelineDisplay";
import { useStories } from "@/hooks/useStories";
import { useGallery } from "@/hooks/useGallery";

interface MuseumDetailsProps {
  museum: Museum;
  stories: Story[];
  events?: Event[];
  timeline?: any;
}

export default function MuseumDetails({ museum, stories, events = [], timeline }: MuseumDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { mediaItems } = useGallery({ museumId: museum.id });
  const { toast } = useToast();

  const currentUrl = window.location.href;

  // create a slugified subdomain of a specific museum.
  const museumUrl = createMuseumSubdomain(museum);

  const handleShare = (platform: string) => {
    const title = `Visit ${museum.name}`;
    const text = `Discover the amazing collections and stories at ${museum.name} - ${museum.description.slice(0, 100)}...`;

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(currentUrl).then(() => {
          toast({
            title: "Link copied!",
            description: "Museum page link has been copied to your clipboard",
            variant: "default",
          });
        });
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\nVisit: ${currentUrl}`)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${currentUrl}`)}`, '_blank');
        break;
    }
  };

  const handleVisitWebsite = () => {
    if (museum.website) {
      // Use the actual website URL if provided
      window.open(museum.website, '_blank');
    } else {
      // Create subdomain URL based on museum name
      window.open(museumUrl, '_blank');
    }
  };
  
  return (
    <div className="bg-neutral-offwhite rounded-lg shadow-md overflow-hidden mb-8">
      <img 
        src={museum.featuredImageUrl || "https://placehold.co/1280x400?text=Museum+Gallery"}
        alt={`${museum.name} Gallery`} 
        className="w-full h-64 object-cover"
      />
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-primary">{museum.name}</h1>
            <div className="flex items-center mt-2 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive mr-2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{museum.location}, {museum.city}, {museum.country}</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button
              onClick={handleVisitWebsite}
              className="px-4 py-2 bg-destructive text-white rounded-md font-montserrat text-sm font-medium hover:bg-destructive/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" x2="22" y1="12" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              Visit Website
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="px-4 py-2 border border-primary text-primary rounded-md font-montserrat text-sm font-medium hover:bg-primary/5 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" x2="12" y1="2" y2="15"></line>
                  </svg>
                  Share
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleShare('copy')} className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                  </svg>
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('twitter')} className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
                  </svg>
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('email')} className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview" className={activeTab === "overview" ? "tab-active" : ""}>Overview</TabsTrigger>
            <TabsTrigger value="gallery" className={activeTab === "gallery" ? "tab-active" : ""}>Gallery</TabsTrigger>
            <TabsTrigger value="stories" className={activeTab === "stories" ? "tab-active" : ""}>Stories</TabsTrigger>
            <TabsTrigger value="events" className={activeTab === "events" ? "tab-active" : ""}>Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="prose max-w-none text-muted-foreground">
              <p>{museum.description}</p>
              <p>Established as one of the premier cultural institutions in {museum.city}, the museum hosts a diverse collection spanning multiple centuries and artistic movements.</p>
            </div>
            
            {timeline && (
              <div className="mt-8">
                <TimelineDisplay timeline={timeline} />
              </div>
            )}
            
            {events && events.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-playfair font-bold text-primary mb-4">Current Exhibitions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {events.map((event) => (
                    <div key={event.id} className="bg-white p-4 rounded border border-muted">
                      <h4 className="font-bold text-primary">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Running until {formatDate(event.endDate || event.eventDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="gallery">
            <div className="mb-8">
              <h3 className="text-2xl font-playfair font-bold text-primary mb-4">Gallery Highlights</h3>
              {mediaItems && mediaItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mediaItems.slice(0, 12).map((item) => (
                    <div key={item.id} className="group relative cursor-pointer" onClick={() => setSelectedImage(item.url)}>
                      <img
                        src={item.url}
                        alt={item.title} 
                        className="w-full h-48 object-cover rounded-lg shadow-sm transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center rounded-lg">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-primary truncate">{item.title}</h4>
                        {item.description && (
                          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-muted">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                  <p className="text-muted-foreground">No gallery items available at this time.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="stories">
            <div className="mb-8">
              <h3 className="text-2xl font-playfair font-bold text-primary mb-4">Museum Stories</h3>
              {stories && stories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stories.map(story => (
                    <div key={story.id} className="bg-white rounded-lg shadow-sm p-6 border border-muted hover:shadow-md transition-shadow">
                      {story.featuredImageUrl && (
                        <img
                          src={story.featuredImageUrl}
                          alt={story.title} 
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-playfair font-bold text-primary">{story.title}</h3>
                        {story.isFeatured && (
                          <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded-full font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{story.summary}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {story.tags && story.tags.slice(0, 3).map((tag: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                          {story.tags && story.tags.length > 3 && (
                            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                              +{story.tags.length - 3} more
                            </span>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary border-primary hover:bg-primary hover:text-white transition-colors"
                          onClick={() => window.open(`/stories/${story.id}`, '_blank')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M7 7h10v10"></path>
                            <path d="M7 17 17 7"></path>
                          </svg>
                          Read More
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-muted">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" x2="8" y1="13" y2="13"></line>
                    <line x1="16" x2="8" y1="17" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                  <p className="text-muted-foreground">No stories available at this time.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <div className="space-y-4">
              {events.length > 0 ? (
                events.map(event => (
                  <div key={event.id} className="bg-white p-5 rounded-lg border border-muted">
                    <div className="flex items-start">
                      <div className="bg-muted rounded-md w-16 h-16 flex flex-col items-center justify-center text-center mr-4">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(event.eventDate, 'MMM')}
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {formatDate(event.eventDate, 'dd')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-white rounded-lg border border-muted">
                  <p className="text-muted-foreground">No upcoming events at this time. Check back later!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Gallery item"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 6-12 12"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
