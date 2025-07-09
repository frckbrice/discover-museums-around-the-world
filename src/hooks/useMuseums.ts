import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Museum } from "@/types";
import { apiRequest } from "@/lib/queryClient";

interface UseMuseumsOptions {
  approved?: boolean;
  featured?: boolean;
  type?: string;
  active?: boolean;
  limit?: number;
  offset?: number;
  searchQuery?: string;
}

export function useMuseums(options: UseMuseumsOptions = {}) {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [totalMuseums, setTotalMuseums] = useState<number>(0);

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (options.approved !== undefined) queryParams.append("approved", options.approved.toString());
  if (options.featured !== undefined) queryParams.append("featured", options.featured.toString());
  if (options.type) queryParams.append("type", options.type);
  if (options.active !== undefined) queryParams.append("active", options.active.toString());
  if (options.limit !== undefined) queryParams.append("limit", options.limit.toString());
  if (options.offset !== undefined) queryParams.append("offset", options.offset.toString());
  if (options.searchQuery) queryParams.append("search", options.searchQuery);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/museums?${queryString}` : "/museums";

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<any>({
    queryKey: [endpoint],
    queryFn: async () => {
      const response = await apiRequest('GET', endpoint);
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (data) {
      // Check if data is an array (direct response) or an object with museums property
      if (Array.isArray(data)) {
        setMuseums(data);
        setTotalMuseums(data.length);
      } else if (data.museums) {
        setMuseums(data.museums);
        setTotalMuseums(data.total || 0);
      } else {
        setMuseums([]);
        setTotalMuseums(0);
      }
    }
  }, [data]);

  // Method to manually update museums (e.g., after operations)
  const updateMuseums = async (updatedMuseum: Museum) => {
    // Update the museum in the local state if it exists
    setMuseums(prev =>
      prev.map(museum =>
        museum.id === updatedMuseum.id ? updatedMuseum : museum
      )
    );

    // Refetch to ensure we have the latest data
    await refetch();
  };

  // Method to add a new museum to the cache
  const addMuseum = async (newMuseum: Museum) => {
    setMuseums(prev => [...prev, newMuseum]);
    setTotalMuseums(prev => prev + 1);

    // Refetch to ensure we have the latest data
    await refetch();
  };

  // Method to remove a museum from the cache
  const removeMuseum = async (museumId: string) => {
    setMuseums(prev => prev.filter(museum => museum.id !== museumId));
    setTotalMuseums(prev => prev - 1);

    // Refetch to ensure we have the latest data
    await refetch();
  };

  return {
    museums,
    totalMuseums,
    isLoading,
    isError,
    error,
    refetch,
    updateMuseums,
    addMuseum,
    removeMuseum
  };
}
