"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import MuseumCard from "@/components/shared/MuseumCard";
import StoryCard from "@/components/shared/StoryCard";
import { useMuseums } from "@/hooks/useMuseums";
import { useStories } from "@/hooks/useStories";
import Link from "next/link";
import Sliders from "@/components/shared/Slider";
import { BookOpen, MapPin } from "lucide-react";
import FloatingParticles from "@/components/shared/FloatingParticles";

export default function HomePage() {
  const { museums, isLoading: isLoadingMuseums } = useMuseums({
    approved: true,
    featured: true,
    limit: 3,
  });

  const { stories, isLoading: isLoadingStories } = useStories({
    published: true,
    approved: true,
    limit: 3,
  });

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden bg-gray-900">
        {/* Background with parallax effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-[url('/images/ian-dooley-ZLBzMGle-nE-unsplash.jpg')] bg-cover bg-center"
            style={{
              transform: "translateZ(0)",
              willChange: "transform",
              backgroundAttachment: "fixed",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/50 to-primary/30"></div>
        </div>

        {/* Particle decoration */}
        <FloatingParticles />

        {/* Content */}
        <div className="relative z-20 h-screen flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Text content */}
              <div className="lg:w-1/2 text-center lg:text-left">
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
                  <span>Discover Our Collections</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                  <span className="block">Explore the</span>
                  <span className="text-foreground block">
                    World's Cultural Heritage
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                  Immerse yourself in stories and artifacts from museums across
                  the globe.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/map">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-medium transition-all hover:shadow-lg hover:translate-y-[-2px]"
                    >
                      <MapPin className="mr-2 h-5 w-5" />
                      Find Museums
                    </Button>
                  </Link>
                  <Link href="/stories">
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-transparent hover:bg-white/10 text-white border-white px-8 py-6 text-lg font-medium backdrop-blur-sm transition-all hover:shadow-lg hover:translate-y-[-2px]"
                    >
                      <BookOpen className="mr-2 h-5 w-5" />
                      Explore Stories
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Slider - only visible on large screens */}
              <div className="hidden lg:block lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm p-4">
                  <Sliders />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <section className="relative bg-card/80 backdrop-blur-md rounded-xl shadow-xl max-w-2xl mx-6 md:mx-auto my-20 p-8 text-center z-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Call Us Today
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-6">
            We're here to help you. Reach out anytime.
          </p>
          <a
            href="tel:08063255399"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-full transition shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5h2l3.6 7.59L5.25 17H19v2H5a1 1 0 01-1-1V6H3V5zm13 0h5v2h-5V5z"
              />
            </svg>
            0806 325 5399
          </a>
        </section>
        {/* Parallax Background Layer */}
        <div
          className="absolute inset-0 bg-[url('/images/photorealistic-refugee-camp-min.jpg')] bg-cover bg-center bg-no-repeat bg-fixed opacity-40 z-0"
          aria-hidden="true"
        ></div>

        {/* Foreground Content */}
        <div className="relative z-10 lg:px-20 bg-gradient-to-b from-background/90 to-muted/10 backdrop-blur-sm">
          <div className="container mx-auto py-20 px-6 sm:px-10 md:px-20">
            <div className="flex justify-between items-end mb-14">
              <div>
                <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-primary leading-tight">
                  Featured Museums
                </h2>
                <p className="text-lg text-muted-foreground mt-2 font-inter">
                  Exceptional collections and immersive experiences
                </p>
              </div>
              <Link href="/map">
                <span className="text-destructive text-base font-montserrat font-semibold hover:underline flex items-center gap-1">
                  View All
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </span>
              </Link>
            </div>

            {/* Grid of Museums */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {isLoadingMuseums ? (
                [...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg animate-pulse p-6"
                  >
                    <div className="w-full h-52 bg-muted rounded-xl mb-6"></div>
                    <div className="h-6 bg-muted rounded w-2/3 mb-3"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                ))
              ) : museums && museums.length > 0 ? (
                museums.map((museum, index) => (
                  <MuseumCard
                    key={museum.id}
                    museum={museum}
                    featured={index === 0}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground text-lg font-inter">
                    No featured museums available at this time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Highlighted Stories */}
        <div className="bg-background relative z-10">
          <div className="container mx-auto py-20 px-6 sm:px-10 md:px-20">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-playfair font-bold text-primary">
                  Featured Stories
                </h2>
                <p className="text-muted-foreground mt-2">
                  Compelling narratives from our museum network
                </p>
              </div>
              <Link href="/stories">
                <span className="text-destructive font-montserrat font-medium hover:underline">
                  View All{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1 inline-block"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </span>
              </Link>
            </div>

            {isLoadingStories ? (
              // Loading skeleton
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1 md:col-span-2 bg-background rounded-lg overflow-hidden shadow-md p-4">
                  <div className="w-full h-64 bg-muted animate-pulse rounded mb-4"></div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-muted animate-pulse rounded-full"></div>
                    <div className="ml-3">
                      <div className="h-4 bg-muted animate-pulse rounded w-40"></div>
                      <div className="h-3 bg-muted animate-pulse rounded w-24 mt-1"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-5/6"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-1/4 mt-4"></div>
                </div>
                <div className="col-span-1 space-y-6">
                  <div className="bg-background rounded-lg overflow-hidden shadow-md p-4">
                    <div className="h-5 bg-muted animate-pulse rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-full mb-3"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
                  </div>
                  <div className="bg-background rounded-lg overflow-hidden shadow-md p-4">
                    <div className="h-5 bg-muted animate-pulse rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-full mb-3"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ) : stories && stories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* First story - featured */}
                <div className="col-span-1 md:col-span-2">
                  <StoryCard story={stories[0]} featured={true} />
                </div>

                {/* 2nd and 3rd stories */}
                <div className="col-span-1 space-y-6">
                  {stories.slice(1, 3).map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No featured stories available at this time.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Map */}
        <div className="relative z-10 bg-gradient-to-b from-background/90 to-muted/10 backdrop-blur-sm">
          <div className="container mx-auto py-20 px-6 sm:px-10 md:px-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-playfair font-bold text-primary">
                Explore Museums Worldwide
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Discover museums near you or plan your next cultural journey
                with our interactive map
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96 bg-muted relative">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  style={{
                    backgroundImage:
                      "url('/images/photorealistic-refugee-camp.jpg')",
                    backgroundSize: "cover",
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center bg-white bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto text-destructive mb-3"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <h3 className="text-xl font-playfair font-bold text-primary">
                      Interactive Museum Map
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Explore our global network of museums. Click the button
                      below to open the full interactive map.
                    </p>
                    <Link href="/map">
                      <Button className="mt-4 bg-destructive text-white">
                        Open Full Map
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-muted">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="default"
                    className="bg-primary text-white rounded-full text-sm font-montserrat"
                  >
                    All Museums
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-muted text-muted-foreground rounded-full text-sm font-montserrat"
                  >
                    Art
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-muted text-muted-foreground rounded-full text-sm font-montserrat"
                  >
                    History
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-muted text-muted-foreground rounded-full text-sm font-montserrat"
                  >
                    Science
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-muted text-muted-foreground rounded-full text-sm font-montserrat"
                  >
                    Natural History
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-muted text-muted-foreground rounded-full text-sm font-montserrat"
                  >
                    Technology
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
