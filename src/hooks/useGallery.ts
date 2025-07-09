import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "../../../badagry_backend/types";

interface UseGalleryOptions {
  museumId?: string;
  galleryId?: string;
  approved?: boolean;
  mediaType?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
  searchQuery?: string;
}

export function useGallery(options: UseGalleryOptions = {}) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Build query parameters
  const queryParams = new URLSearchParams();
  // Safely handle null or undefined values
  if (options.museumId !== undefined && options.museumId !== null) {
    queryParams.append("museumId", options.museumId.toString());
  }
  if (options.galleryId) queryParams.append("galleryId", options.galleryId);
  if (options.approved !== undefined) queryParams.append("approved", options.approved.toString());
  if (options.mediaType) queryParams.append("mediaType", options.mediaType);
  if (options.tags && options.tags.length > 0) {
    options.tags.forEach(tag => queryParams.append("tag", tag));
  }
  if (options.limit !== undefined) queryParams.append("limit", options.limit.toString());
  if (options.offset !== undefined) queryParams.append("offset", options.offset.toString());
  if (options.searchQuery) queryParams.append("search", options.searchQuery);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/media-items?${queryString}` : "/media-items";

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<any>({
    queryKey: [endpoint],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (data) {
      // Check if data is an array (direct response) or an object with mediaItems property
      if (Array.isArray(data)) {
        setMediaItems(data);
        setTotalItems(data.length);
      } else if (typeof data === 'object' && data.mediaItems) {
        setMediaItems(data.mediaItems);
        setTotalItems(data.total || data.mediaItems.length || 0);
      } else {
        // Last fallback - try to handle unexpected response structures
        console.warn("Unexpected media data structure:", data);
        try {
          const possibleItems = Object.values(data).find(val => Array.isArray(val));
          if (possibleItems) {
            setMediaItems(possibleItems as MediaItem[]);
            setTotalItems(possibleItems.length);
          } else {
            setMediaItems([]);
            setTotalItems(0);
          }
        } catch (e) {
          console.error("Error parsing media data:", e);
          setMediaItems([]);
          setTotalItems(0);
        }
      }
    } else {
      setMediaItems([]);
      setTotalItems(0);
    }
  }, [data]);

  // Method to manually update media items (e.g., after operations)
  const updateMediaItem = async (updatedItem: MediaItem) => {
    // Update the media item in the local state if it exists
    setMediaItems(prev => 
      prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    
    // Refetch to ensure we have the latest data
    await refetch();
  };

  // Method to add a new media item to the cache
  const addMediaItem = async (newItem: MediaItem) => {
    setMediaItems(prev => [newItem, ...prev]);
    setTotalItems(prev => prev + 1);
    
    // Refetch to ensure we have the latest data
    await refetch();
  };

  // Method to remove a media item from the cache
  const removeMediaItem = async (itemId: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== itemId));
    setTotalItems(prev => prev - 1);
    
    // Refetch to ensure we have the latest data
    await refetch();
  };

  return {
    mediaItems,
    totalItems,
    isLoading,
    isError,
    error,
    refetch,
    updateMediaItem,
    addMediaItem,
    removeMediaItem
  };
}
