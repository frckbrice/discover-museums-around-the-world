import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Story } from "@/types";
import { apiRequest } from "@/lib/queryClient";

interface UseStoriesOptions {
  museumId?: string;
  published?: boolean;
  approved?: boolean;
  featured?: boolean;
  tags?: string[];
  sortOrder?: "newest" | "oldest" | "featured" | "popular";
  page?: number;
  limit?: number;
  searchQuery?: string;
}

export function useStories(options: UseStoriesOptions = {}) {
  const [stories, setStories] = useState<Story[]>([]);
  const [totalStories, setTotalStories] = useState<number>(0);

  // Build query parameters
  const queryParams = new URLSearchParams();
  // Safely handle null or undefined values by doing null checks
  if (options.museumId !== undefined && options.museumId !== null) {
    queryParams.append("museumId", options.museumId.toString());
  }
  if (options.published !== undefined) queryParams.append("published", options.published.toString());
  if (options.approved !== undefined) queryParams.append("approved", options.approved.toString());
  if (options.featured !== undefined) queryParams.append("featured", options.featured.toString());
  if (options.tags && options.tags.length > 0) {
    options.tags.forEach(tag => queryParams.append("tag", tag));
  }
  if (options.sortOrder) queryParams.append("sortOrder", options.sortOrder);
  if (options.page !== undefined) queryParams.append("page", options.page.toString());
  if (options.limit !== undefined) queryParams.append("limit", options.limit.toString());
  if (options.searchQuery) queryParams.append("search", options.searchQuery);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/stories?${queryString}` : "/stories";

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<Story | any>({
    queryKey: [endpoint],
    queryFn: async () => {
      const response = await apiRequest('GET', endpoint);
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (data) {
      console.log("Stories data received:", data);
      // Check if data is an array (direct response) or an object with stories property
      if (Array.isArray(data)) {
        setStories(data);
        setTotalStories(data.length);
      } else if (typeof data === 'object' && data.stories) {
        setStories(data.stories);
        setTotalStories(data.total || data.stories.length || 0);
      } else {
        // Last fallback - try to handle unexpected response structures
        console.warn("Unexpected stories data structure:", data);
        try {
          const possibleStories = Object.values(data).find(val => Array.isArray(val));
          if (possibleStories) {
            setStories(possibleStories as Story[]);
            setTotalStories(possibleStories.length);
          } else {
            setStories([]);
            setTotalStories(0);
          }
        } catch (e) {
          console.error("Error parsing stories data:", e);
          setStories([]);
          setTotalStories(0);
        }
      }
    } else {
      setStories([]);
      setTotalStories(0);
    }
  }, [data]);

  // Method to manually update stories (e.g., after operations)
  const updateStory = async (updatedStory: Story) => {
    // Update the story in the local state if it exists
    setStories(prev =>
      prev.map(story =>
        story.id === updatedStory.id ? updatedStory : story
      )
    );

    // Refetch to ensure we have the latest data
    await refetch();
  };

  // Method to add a new story to the cache
  const addStory = async (newStory: Story) => {
    setStories(prev => [newStory, ...prev]);
    setTotalStories(prev => prev + 1);

    // Refetch to ensure we have the latest data
    await refetch();
  };

  // Method to remove a story from the cache
  const removeStory = async (storyId: string) => {
    setStories(prev => prev.filter(story => story.id !== storyId));
    setTotalStories(prev => prev - 1);

    // Refetch to ensure we have the latest data
    await refetch();
  };

  return {
    stories,
    totalStories,
    isLoading,
    isError,
    error,
    refetch,
    updateStory,
    addStory,
    removeStory
  };
}
