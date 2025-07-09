"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Calendar,
  MessageSquare,
  Image,
  FileText,
  Clock,
  TrendingUp,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function ActivitiesView() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch recent activities data
  // const { data: activities, isLoading: isActivitiesLoading } = useQuery({
  //   queryKey: ['/admin/activities', user?.museumId],
  //   enabled: !!user?.museumId
  // });

  // Fetch contact messages
  const { data: messages, isLoading: isMessagesLoading } = useQuery({
    queryKey: ["/contact-messages", user?.museumId],
    enabled: !!user?.museumId,
  });

  // Fetch recent stories
  const { data: stories, isLoading: isStoriesLoading } = useQuery({
    queryKey: ["/stories", user?.museumId],
    enabled: !!user?.museumId,
  });

  // Fetch recent media items
  const { data: mediaItems, isLoading: isMediaLoading } = useQuery({
    queryKey: ["/media-items", user?.museumId],
    enabled: !!user?.museumId,
  });

  // Fetch events
  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ["/events", user?.museumId],
    enabled: !!user?.museumId,
  });

  // Create combined activity feed
  const createActivityFeed = () => {
    const feed: any[] = [];

    // Add contact messages
    if (Array.isArray(messages)) {
      messages.forEach((message: any) => {
        feed.push({
          id: `message-${message.id}`,
          type: "message",
          title: `New inquiry: ${message.subject}`,
          description: `From ${message.name} (${message.email})`,
          timestamp: message.createdAt,
          status: message.isRead ? "read" : "unread",
          icon: MessageSquare,
          color: "text-blue-600",
        });
      });
    }

    // Add stories
    if (Array.isArray(stories)) {
      stories.forEach((story: any) => {
        feed.push({
          id: `story-${story.id}`,
          type: "story",
          title: `Story: ${story.title}`,
          description: story.isPublished ? "Published" : "Draft",
          timestamp: story.updatedAt || story.createdAt,
          status: story.isPublished ? "published" : "draft",
          icon: FileText,
          color: "text-green-600",
        });
      });
    }

    // Add media items
    if (Array.isArray(mediaItems)) {
      mediaItems.forEach((item: any) => {
        feed.push({
          id: `media-${item.id}`,
          type: "media",
          title: `Media: ${item.title}`,
          description: `${item.mediaType} in ${
            item.galleryId || "default gallery"
          }`,
          timestamp: item.createdAt,
          status: item.isApproved ? "approved" : "pending",
          icon: Image,
          color: "text-purple-600",
        });
      });
    }

    // Add events
    if (Array.isArray(events)) {
      events.forEach((event: any) => {
        feed.push({
          id: `event-${event.id}`,
          type: "event",
          title: `Event: ${event.title}`,
          description: `Scheduled for ${formatDate(event.eventDate)}`,
          timestamp: event.createdAt,
          status: event.isPublished ? "published" : "draft",
          icon: Calendar,
          color: "text-orange-600",
        });
      });
    }

    // Sort by timestamp (newest first)
    return feed.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const activityFeed = createActivityFeed();

  const filteredActivities = activityFeed.filter(
    (activity) =>
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get activity stats
  const stats = {
    totalActivities: activityFeed.length,
    unreadMessages: Array.isArray(messages)
      ? messages.filter((m: any) => !m.isRead).length
      : 0,
    draftContent: [
      ...(Array.isArray(stories) ? stories : []),
      ...(Array.isArray(events) ? events : []),
    ].filter((item: any) => !item.isPublished).length,
    pendingApprovals: Array.isArray(mediaItems)
      ? mediaItems.filter((item: any) => !item.isApproved).length
      : 0,
  };

  const getStatusBadge = (status: string, type: string) => {
    const statusConfig = {
      unread: { variant: "destructive" as const, label: "Unread" },
      read: { variant: "outline" as const, label: "Read" },
      published: { variant: "default" as const, label: "Published" },
      draft: { variant: "secondary" as const, label: "Draft" },
      approved: { variant: "default" as const, label: "Approved" },
      pending: { variant: "outline" as const, label: "Pending" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "outline" as const,
      label: status,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-primary">
            Activities
          </h1>
          <p className="text-muted-foreground mt-1">
            View all recent activities and updates
          </p>
        </div>
        <Link href="/admin/events/new">
          <Button className="bg-destructive text-white hover:bg-destructive/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Activities
                </p>
                <p className="text-2xl font-bold">{stats.totalActivities}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Unread Messages
                </p>
                <p className="text-2xl font-bold">{stats.unreadMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Draft Content
                </p>
                <p className="text-2xl font-bold">{stats.draftContent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Approvals
                </p>
                <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Activities Feed */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              {isMessagesLoading ||
              isStoriesLoading ||
              isMediaLoading ||
              isEventsLoading ? (
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-4 p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-foreground">
                    No activities
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Activities will appear here as they happen.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredActivities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className={`p-2 rounded-full bg-muted ${activity.color}`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground truncate">
                              {activity.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(activity.status, activity.type)}
                              <span className="text-xs text-muted-foreground">
                                {formatDate(activity.timestamp)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {isMessagesLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : !Array.isArray(messages) || messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-foreground">
                    No messages
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Contact messages will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(Array.isArray(messages) ? messages : []).map(
                    (message: any) => (
                      <div key={message.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{message.subject}</h4>
                            {getStatusBadge(
                              message.isRead ? "read" : "unread",
                              "message"
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          From: {message.name} ({message.email})
                        </p>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredActivities
                  .filter((activity) =>
                    ["story", "media"].includes(activity.type)
                  )
                  .map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 border rounded-lg"
                      >
                        <div
                          className={`p-2 rounded-full bg-muted ${activity.color}`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {activity.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(activity.status, activity.type)}
                              <span className="text-xs text-muted-foreground">
                                {formatDate(activity.timestamp)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredActivities
                  .filter((activity) => activity.type === "event")
                  .map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 border rounded-lg"
                      >
                        <div
                          className={`p-2 rounded-full bg-muted ${activity.color}`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {activity.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(activity.status, activity.type)}
                              <span className="text-xs text-muted-foreground">
                                {formatDate(activity.timestamp)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
