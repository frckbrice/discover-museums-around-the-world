"use client";

import { useState, useEffect } from "react";
import { useMuseums } from "@/hooks/useMuseums";
import MapExplorer from "@/components/museum/MapExplorer";
import SearchMuseums from "@/components/museum/SearchMuseums";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { museumTypes } from "@/lib/utils";
import { MapPin, Search, ChevronDown } from "lucide-react";

export default function MapPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuseum, setSelectedMuseum] = useState<string | null>(null);

  const { museums, isLoading, refetch } = useMuseums({
    approved: true,
    active: true,
    type: selectedType || undefined,
  });

  useEffect(() => {
    refetch();
  }, [selectedType, refetch]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type);
  };

  const handleMuseumSelect = (museumId: string) => {
    setSelectedMuseum(museumId);
  };

  // Filter museums by search query if provided
  const filteredMuseums = searchQuery
    ? museums?.filter(
      (museum) =>
        museum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        museum.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        museum.country.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : museums;

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section */}
      <div className="relative h-[90vh] md:h-[95vh] overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/photorealistic-refugee-camp-min.jpg" // Replace with your actual image path
            alt="Museum interior"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10 flex flex-col justify-center">
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1.5 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-colors"
            >
              {/* <Museum className="h-4 w-4 mr-2" /> */}
              <span className="font-medium">Global Museum Explorer</span>
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4 leading-tight drop-shadow-lg">
              Discover Cultural Treasures{" "}
              <span className="text-yellow-300">Worldwide</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md">
              Explore museums from around the globe. Search by name, location,
              or browse our interactive map to find your next cultural
              destination.
            </p>

            <div className="bg-white rounded-xl p-1 shadow-xl w-full max-w-2xl">
              <SearchMuseums
                onSearch={handleSearchChange}
                value={searchQuery}
              // className="border-0 focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6  p-4 md:p-12 -mt-12 relative z-10">
        {/* Filters Section */}
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden mb-8">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedType === null ? "default" : "outline"}
                  className="rounded-full gap-2"
                  onClick={() => handleTypeFilter(null)}
                >
                  <span>All Museums</span>
                  <Badge variant="secondary" className="px-2 py-0.5">
                    {museums?.length || 0}
                  </Badge>
                </Button>
                {museumTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={
                      selectedType === type.value ? "default" : "outline"
                    }
                    className="rounded-full gap-2"
                    onClick={() => handleTypeFilter(type.value)}
                  >
                    <span>{type.label}</span>
                    <Badge variant="secondary" className="px-2 py-0.5">
                      {museums?.filter((m) => m.museumType === type.value)
                        .length || 0}
                    </Badge>
                  </Button>
                ))}
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="rounded-full gap-2">
                    <span>Museum Statistics</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Museum Breakdown</h3>
                    <div className="space-y-3">
                      {museumTypes.map((type) => {
                        const count =
                          museums?.filter((m) => m.museumType === type.value)
                            .length || 0;
                        return (
                          <div
                            key={type.value}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{type.label}</span>
                            </div>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Map and List Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Column */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0 h-full">
                {isLoading ? (
                  <div className="w-full h-full bg-muted/50 flex flex-col items-center justify-center gap-4">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-muted h-12 w-12"></div>
                    </div>
                    <p className="text-muted-foreground">
                      Loading world map...
                    </p>
                  </div>
                ) : (
                  <MapExplorer
                    museums={filteredMuseums || []}
                    selectedMuseumId={selectedMuseum}
                    onMuseumSelect={handleMuseumSelect}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* List Column */}
          <div className="h-[600px] overflow-hidden">
            <Card className="h-full border-0 shadow-lg">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-playfair font-bold">
                    {searchQuery
                      ? `Search Results (${filteredMuseums?.length || 0})`
                      : selectedType
                        ? `${museumTypes.find((t) => t.value === selectedType)
                          ?.label || selectedType
                        } Museums`
                        : "All Museums"}
                  </h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div className="space-y-4 p-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="border rounded-lg p-4">
                          <Skeleton className="h-6 w-3/4 mb-3" />
                          <Skeleton className="h-4 w-1/2 mb-2" />
                          <Skeleton className="h-4 w-1/3" />
                        </div>
                      ))}
                    </div>
                  ) : filteredMuseums && filteredMuseums.length > 0 ? (
                    <div className="divide-y">
                      {filteredMuseums.map((museum) => (
                        <div
                          key={museum.id}
                          className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${selectedMuseum === museum.id
                            ? "bg-muted/30 border-l-4 border-l-primary"
                            : ""
                            }`}
                          onClick={() => handleMuseumSelect(museum.id)}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-primary">
                              {museum.name}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {museumTypes.find(
                                (t) => t.value === museum.museumType
                              )?.label || museum.museumType}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {museum.city}, {museum.country}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                      <Search className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No museums found
                      </h3>
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? `No results for "${searchQuery}". Try a different search.`
                          : "No museums match your current filters."}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedType(null);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
