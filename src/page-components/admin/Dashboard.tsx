"use client";

import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import Link from "next/link";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const {
    data: dashboardStats,
    isLoading: isStatsLoading
  } = useQuery<any>({
    queryKey: ['/admin/dashboard/stats'],
    enabled: isAuthenticated && !!user?.museumId
  });

  const {
    data: recentActivity = [],
    isLoading: isActivityLoading
  } = useQuery<any[]>({
    queryKey: ['/admin/dashboard/activity'],
    enabled: isAuthenticated && !!user?.museumId
  });

  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading
  } = useQuery<any>({
    queryKey: ['/admin/dashboard/analytics'],
    enabled: isAuthenticated && !!user?.museumId
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      window.location.href = '/admin/auth';
    }
  }, [isAuthLoading, isAuthenticated]);

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="text-center">
          <Skeleton className="h-12 w-48 mb-4 mx-auto" />
          <Skeleton className="h-6 w-64 mb-1 mx-auto" />
          <Skeleton className="h-6 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white border-b border-muted p-4 flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="text-muted-foreground mr-4 lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </Button>
          <h1 className="text-xl font-playfair font-bold text-primary">Dashboard</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-playfair font-bold text-primary mb-6">Welcome to your Museum Dashboard</h2>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isStatsLoading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i} className="dashboard-card">
                <CardContent className="p-6">
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-10 w-16 mb-3" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))
          ) : dashboardStats ? (
            <>
              <Card className="bg-white rounded-lg shadow-sm dashboard-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Stories</p>
                      <p className="text-3xl font-playfair font-bold text-primary mt-2">{dashboardStats.totalStories}</p>
                    </div>
                    <div className="bg-destructive bg-opacity-10 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
                        <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z"></path>
                        <path d="M12 7c1-.56 2.78-2 5-2 .97 0 1.94.32 2.66.85"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-green-600 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 inline-block">
                      <path d="m18 15-6-6-6 6"></path>
                    </svg>
                    {dashboardStats.storyIncrease}% increase from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-lg shadow-sm dashboard-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gallery Views</p>
                      <p className="text-3xl font-playfair font-bold text-primary mt-2">{dashboardStats.galleryViews.toLocaleString()}</p>
                    </div>
                    <div className="bg-accent bg-opacity-10 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-green-600 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 inline-block">
                      <path d="m18 15-6-6-6 6"></path>
                    </svg>
                    {dashboardStats.viewIncrease}% increase from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-lg shadow-sm dashboard-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">New Messages</p>
                      <p className="text-3xl font-playfair font-bold text-primary mt-2">{dashboardStats.newMessages}</p>
                    </div>
                    <div className="bg-primary bg-opacity-10 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                    </div>
                  </div>
                  {dashboardStats.unreadMessages > 0 ? (
                    <div className="mt-4 text-sm text-amber-500 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 inline-block">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" x2="12" y1="8" y2="12"></line>
                        <line x1="12" x2="12.01" y1="16" y2="16"></line>
                      </svg>
                      {dashboardStats.unreadMessages} require response
                    </div>
                  ) : (
                    <div className="mt-4 text-sm text-green-600 font-medium">
                      All messages have been read
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white rounded-lg shadow-sm dashboard-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                      <p className="text-3xl font-playfair font-bold text-primary mt-2">{dashboardStats.upcomingEvents}</p>
                    </div>
                    <div className="bg-green-500 bg-opacity-10 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                        <path d="m9 16 2 2 4-4"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground font-medium">
                    {dashboardStats.nextEventDays > 0
                      ? `Next event in ${dashboardStats.nextEventDays} days`
                      : "Event happening today!"
                    }
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="col-span-4 text-center py-6">
              <p className="text-muted-foreground">No dashboard data available.</p>
            </div>
          )}
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-playfair font-bold text-primary">Recent Activity</h3>
              <Link href="/admin/activity">
                <span className="text-sm text-destructive font-medium hover:underline">View All</span>
              </Link>
            </div>

            {isActivityLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity: any, index: number) => (
                  <div key={index} className={`border-l-4 border-${activity.color} pl-4 py-1`}>
                    <p className="text-muted-foreground">
                      {activity.action}
                      <span className="font-medium text-primary"> "{activity.itemTitle}"</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No recent activity found.</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-playfair font-bold text-primary">Quick Actions</h3>
              <div className="h-1 w-12 bg-gradient-to-r from-destructive to-primary rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Create Story Action */}
              <Link href="/admin/stories/new">
                <div className="group relative overflow-hidden bg-gradient-to-br from-destructive to-destructive/90 hover:from-destructive/90 hover:to-destructive text-white rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="12" x2="12" y1="18" y2="12"></line>
                        <line x1="9" x2="15" y1="15" y2="15"></line>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-montserrat font-semibold text-sm">Create New Story</h4>
                      <p className="text-white/80 text-xs mt-1">Share your museum's stories</p>
                    </div>
                    <div className="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform"></div>
                </div>
              </Link>

              {/* Upload Media Action */}
              <Link href="/admin/gallery">
                <div className="group relative overflow-hidden bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-montserrat font-semibold text-sm">Upload Media</h4>
                      <p className="text-white/80 text-xs mt-1">Add photos and videos</p>
                    </div>
                    <div className="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform"></div>
                </div>
              </Link>

              {/* Add Event Action */}
              <Link href="/admin/events/new">
                <div className="group relative overflow-hidden bg-gradient-to-br from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-primary rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer border border-accent/20">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                        <path d="M8 14h.01"></path>
                        <path d="M12 14h.01"></path>
                        <path d="M16 14h.01"></path>
                        <path d="M8 18h.01"></path>
                        <path d="M12 18h.01"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-montserrat font-semibold text-sm">Add Event</h4>
                      <p className="text-primary/70 text-xs mt-1">Schedule museum events</p>
                    </div>
                    <div className="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform"></div>
                </div>
              </Link>

              {/* Edit Profile Action */}
              <Link href="/admin/profile">
                <div className="group relative overflow-hidden bg-gradient-to-br from-muted to-muted/90 hover:from-muted/80 hover:to-muted text-primary rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer border border-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                        <path d="m15 5 4 4"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-montserrat font-semibold text-sm">Edit Museum Profile</h4>
                      <p className="text-primary/70 text-xs mt-1">Update information</p>
                    </div>
                    <div className="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform"></div>
                </div>
              </Link>
            </div>

            {/* Additional Quick Links */}
            <div className="mt-6 pt-6 border-t border-muted/30">
              <div className="grid grid-cols-2 gap-3">
                <Link href="/admin/messages">
                  <div className="group flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-primary">Messages</span>
                  </div>
                </Link>

                <Link href="/admin/settings">
                  <div className="group flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-primary">Settings</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div>
        <h2 className="text-2xl font-playfair font-bold text-primary mb-6">Analytics Overview</h2>

        <Card className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Tabs defaultValue="visitors">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="visitors">Visitors</TabsTrigger>
                <TabsTrigger value="content">Content Performance</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
              </TabsList>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-sm">Last 30 Days</Button>
                <Button variant="ghost" size="sm" className="text-sm">Last Quarter</Button>
                <Button variant="ghost" size="sm" className="text-sm">Year to Date</Button>
              </div>
            </div>

            <TabsContent value="visitors" className="pt-2">
              {isAnalyticsLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : analyticsData?.visitorData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.visitorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="visitors" stroke="#1A365D" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uniqueVisitors" stroke="#9D2235" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                  <p className="text-muted-foreground">No visitor data available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="content" className="pt-2">
              {isAnalyticsLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : analyticsData?.contentData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.contentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#1A365D" />
                    <Bar dataKey="engagement" fill="#9D2235" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                  <p className="text-muted-foreground">No content performance data available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="engagement" className="pt-2">
              {isAnalyticsLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : analyticsData?.engagementData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgTimeSpent" stroke="#1A365D" />
                    <Line type="monotone" dataKey="interactionRate" stroke="#9D2235" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                  <p className="text-muted-foreground">No engagement data available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-3 gap-4 text-center mt-6 pt-6 border-t border-muted">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Most Viewed Story</p>
              <p className="font-bold text-primary">
                {analyticsData?.topPerformers?.topStory || "No data"}
              </p>
              <p className="text-xs text-green-600">
                {analyticsData?.topPerformers?.topStoryViews &&
                  `${analyticsData.topPerformers.topStoryViews.toLocaleString()} views`
                }
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Most Popular Gallery</p>
              <p className="font-bold text-primary">
                {analyticsData?.topPerformers?.topGallery || "No data"}
              </p>
              <p className="text-xs text-green-600">
                {analyticsData?.topPerformers?.topGalleryViews &&
                  `${analyticsData.topPerformers.topGalleryViews.toLocaleString()} views`
                }
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Time on Page</p>
              <p className="font-bold text-primary">
                {analyticsData?.topPerformers?.avgTimeOnPage || "No data"}
              </p>
              <p className="text-xs text-green-600">
                {analyticsData?.topPerformers?.avgTimeIncrease &&
                  `+${analyticsData.topPerformers.avgTimeIncrease}% vs. last month`
                }
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
