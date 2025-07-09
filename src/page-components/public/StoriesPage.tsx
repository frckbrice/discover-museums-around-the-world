"use client";
import { useState, useEffect } from "react";
import { useStories } from "@/hooks/useStories";
import { useMuseums } from "@/hooks/useMuseums";
import { useQuery } from "@tanstack/react-query";
import StoryCard from "@/components/shared/StoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Share2,
  BookmarkPlus,
  Filter,
  Search,
  Calendar,
  MapPin,
  User,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function StoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuseum, setSelectedMuseum] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest" | "featured" | "popular"
  >("newest");
  const [activeView, setActiveView] = useState<"all" | "featured" | "recent">(
    "all"
  );
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const ITEMS_PER_PAGE = 9;

  // Get all museums for filter
  const { museums, isLoading: isLoadingMuseums } = useMuseums({
    approved: true,
  });

  // Get common tags for filter
  const { data: tags, isLoading: isLoadingTags } = useQuery<string[]>({
    queryKey: ['/stories?tags=["technology", "science"]'],
  });

  // Get stories based on filters
  const {
    stories,
    totalStories,
    isLoading: isLoadingStories,
    refetch: refetchStories,
  } = useStories({
    published: true,
    approved: true,
    museumId: selectedMuseum !== "all" ? selectedMuseum : undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    sortOrder,
    page,
    limit: ITEMS_PER_PAGE,
    searchQuery,
  });

  useEffect(() => {
    // Reset to first page when filters change
    setPage(1);
    refetchStories();
  }, [selectedMuseum, selectedTags, sortOrder, searchQuery, refetchStories]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const totalPages = totalStories
    ? Math.ceil(totalStories / ITEMS_PER_PAGE)
    : 0;

  // Social sharing function
  const shareStory = async (story: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.summary,
          url: window.location.origin + `/stories/${story.id}`,
        });
      } catch (error) {
        console.log("Error sharing story:", error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(
        window.location.origin + `/stories/${story.id}`
      );
    }
  };

  // Get featured stories for recommendations
  const { data: featuredStories } = useQuery({
    queryKey: ["/stories?featured=true"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="relative h-[90vh] md:h-[95vh] overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/photorealistic-refugee-camp.jpg" // Replace with your actual image path
            alt="Museum exhibit"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-gray-900/80" />
        </div>

        {/* Content */}
        <div className="container h-full mx-auto px-4 relative z-10 flex flex-col justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1.5 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-colors"
            >
              <Star className="h-4 w-4 mr-2" />
              <span className="font-medium">Curated Museum Stories</span>
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Discover the <span className="text-primary-300">Stories</span>{" "}
              Behind Our Cultural Heritage
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow-md">
              Journey through time with fascinating narratives from museums
              around the world. Each story unveils the mysteries and marvels of
              our shared history.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="shadow-lg bg-primary hover:bg-primary/90 transition-all transform hover:-translate-y-0.5"
              >
                Explore Featured Stories
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="shadow-lg bg-transparent border-white text-white hover:bg-white/10 hover:text-white"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Browse by Museum
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-12 -mt-12 relative z-10">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-12">
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookmarkPlus className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {totalStories || 0}+
              </div>
              <p className="text-sm text-muted-foreground">Stories Available</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {museums?.length || 0}+
              </div>
              <p className="text-sm text-muted-foreground">Museums Featured</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">5 min</div>
              <p className="text-sm text-muted-foreground">Average Read Time</p>
            </CardContent>
          </Card>
        </div>

        {/* View Tabs */}
        <Tabs
          value={activeView}
          onValueChange={(value: string) =>
            setActiveView(value as "all" | "featured" | "recent")
          }
          className="mb-8"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger
              value="all"
              className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <BookmarkPlus className="h-4 w-4" />
              All Stories
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Star className="h-4 w-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Clock className="h-4 w-4" />
              Recent
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col lg:flex-row gap-8 p-4 md:p-12">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Filters */}
            <Card className="mb-8 border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search stories by title, content, or museum..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-base"
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 h-12 px-6"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="border-t pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Museum
                        </label>
                        <Select
                          value={selectedMuseum}
                          onValueChange={setSelectedMuseum}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select a museum" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Museums</SelectItem>
                            {!isLoadingMuseums &&
                              museums &&
                              museums.map((museum) => (
                                <SelectItem
                                  key={museum.id}
                                  value={museum.id.toString()}
                                >
                                  {museum.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Sort by
                        </label>
                        <Select
                          value={sortOrder}
                          onValueChange={(
                            value: "newest" | "oldest" | "featured" | "popular"
                          ) => setSortOrder(value)}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="featured">Featured</SelectItem>
                            <SelectItem value="popular">
                              Most Popular
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Tags Filter */}
                    {isLoadingTags ? (
                      <div className="flex flex-wrap gap-2">
                        {[...Array(8)].map((_, i) => (
                          <Skeleton key={i} className="h-8 w-20 rounded-full" />
                        ))}
                      </div>
                    ) : tags && tags.length > 0 ? (
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Filter by topics
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag: any, index) => (
                            <Badge
                              key={index}
                              variant={
                                selectedTags.includes(tag)
                                  ? "default"
                                  : "outline"
                              }
                              className="cursor-pointer hover:bg-primary/20 transition-colors px-3 py-1.5"
                              onClick={() => handleTagToggle(tag.title)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="flex justify-end pt-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedMuseum("all");
                          setSelectedTags([]);
                          setSortOrder("newest");
                        }}
                        className="text-primary hover:bg-primary/10"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stories Grid */}
            {isLoadingStories ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Skeleton className="w-full h-48 rounded-b-none" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : stories && stories.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stories.map((story) => (
                    <Card
                      key={story.id}
                      className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow duration-300 group"
                    >
                      <div className="relative overflow-hidden">
                        {story.featuredImageUrl && (
                          <img
                            src={story.featuredImageUrl}
                            alt={story.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        {story.isFeatured && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-yellow-500/90 text-white shadow-md">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <MapPin className="h-4 w-4" />
                          {museums?.find((m) => m.id === story.museumId)?.name}
                          <Separator orientation="vertical" className="h-4" />
                          <Calendar className="h-4 w-4" />
                          {story.publishedAt
                            ? new Date(story.publishedAt).toLocaleDateString()
                            : "Recently"}
                        </div>

                        <h3 className="text-xl font-playfair font-bold mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                          {story.title}
                        </h3>

                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {story.summary}
                        </p>

                        {story.tags && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {story.tags.slice(0, 3).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs px-2 py-1"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-primary text-primary hover:bg-primary/10"
                            asChild
                          >
                            <a href={`/stories/${story.id}`}>Read Story</a>
                          </Button>

                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-primary"
                              onClick={() => shareStory(story)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center mt-12 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="h-10 w-24"
                      >
                        Previous
                      </Button>

                      {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 7) {
                          pageNum = i + 1;
                        } else if (page <= 4) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 3) {
                          pageNum = totalPages - 6 + i;
                        } else {
                          pageNum = page - 3 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            onClick={() => setPage(pageNum)}
                            className="h-10 w-10 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}

                      <Button
                        variant="outline"
                        onClick={() =>
                          setPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={page === totalPages}
                        className="h-10 w-24"
                      >
                        Next
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
                      {Math.min(page * ITEMS_PER_PAGE, totalStories || 0)} of{" "}
                      {totalStories} stories
                    </p>
                  </div>
                )}
              </>
            ) : (
              <Card className="text-center p-12 border-0 shadow-sm">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-playfair font-bold text-foreground mb-3">
                  No Stories Found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? `No stories match your search for "${searchQuery}". Try adjusting your search terms or filters.`
                    : "No stories match your current filters. Try adjusting your criteria."}
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedMuseum("all");
                    setSelectedTags([]);
                    setSortOrder("newest");
                    setActiveView("all");
                  }}
                  className="px-8 py-4"
                >
                  Reset All Filters
                </Button>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Trending Topics */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tags?.slice(0, 6).map((tag: any, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="w-full justify-start cursor-pointer hover:bg-primary/10 px-4 py-2"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag?.title}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Museums */}
            {museums && museums.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    Featured Museums
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {museums.slice(0, 3).map((museum) => (
                      <div
                        key={museum.id}
                        className="flex items-center space-x-3 group"
                      >
                        {museum.logoUrl && (
                          <div className="relative flex-shrink-0">
                            <img
                              src={museum.logoUrl}
                              alt={museum.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white group-hover:border-primary/50 transition-colors shadow-sm"
                            />
                            <div className="absolute inset-0 rounded-full border border-black/5"></div>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {museum.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {museum.city}, {museum.country}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">Stay Updated</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Get notified when new stories are published from your favorite
                  museums.
                </p>
                <div className="space-y-3">
                  <Input
                    placeholder="Enter your email"
                    className="bg-white/90"
                  />
                  <Button className="w-full shadow-md">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
