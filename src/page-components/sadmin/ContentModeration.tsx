"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Search, Info, Eye } from "lucide-react";
import { Story, MediaItem, Museum } from "../../../../badagry_backend/types";
import { useRouter } from "next/navigation";


export default function ContentModeration() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  // Redirect if not authenticated or not super admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "super_admin")) {
      router.push("/admin/login");
    }
  }, [authLoading, isAuthenticated, router, user]);

  // Fetch content that needs moderation
  const { data: pendingStories, isLoading: storiesLoading } = useQuery<Story[]>({
    queryKey: ['/superadmin/moderation/stories'],
    enabled: isAuthenticated && user?.role === "super_admin",
  });

  const { data: pendingMedia, isLoading: mediaLoading } = useQuery({
    queryKey: ['/superadmin/moderation/media'],
    enabled: isAuthenticated && user?.role === "super_admin",
  });

  // Fetch museums for display names
  const { data: museums } = useQuery<Museum[]>({
    queryKey: ['/superadmin/museums'],
    enabled: isAuthenticated && user?.role === "super_admin",
  });

  // Content approval mutations
  const approveStoryMutation = useMutation({
    mutationFn: async (storyId: string) => {
      const response = await apiRequest("PATCH", `/superadmin/stories/${storyId}/approve`, {});
      return response.json();
    },
    onSuccess: () => {
      // Invalidate both the moderation endpoint and the public stories endpoint
      queryClient.invalidateQueries({ queryKey: ['/superadmin/moderation/stories'] });
      queryClient.invalidateQueries({ queryKey: ['/stories'] });

      toast({
        title: "Story approved",
        description: "The story has been approved and is now visible to the public",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Approval failed",
        description: error.message || "There was an error approving the story",
        variant: "destructive",
      });
    }
  });

  const rejectStoryMutation = useMutation({
    mutationFn: async (storyId: string) => {
      const response = await apiRequest("PATCH", `/superadmin/stories/${storyId}/reject`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/superadmin/moderation/stories'] });

      toast({
        title: "Story rejected",
        description: "The story has been rejected",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Rejection failed",
        description: error.message || "There was an error rejecting the story",
        variant: "destructive",
      });
    }
  });

  const approveMediaMutation = useMutation({
    mutationFn: async (mediaId: string) => {
      const response = await apiRequest("PATCH", `/superadmin/media/${mediaId}/approve`, {});
      return response.json();
    },
    onSuccess: () => {
      // Invalidate both the moderation endpoint and the public media endpoint
      queryClient.invalidateQueries({ queryKey: ['/superadmin/moderation/media'] });
      queryClient.invalidateQueries({ queryKey: ['/media'] });

      toast({
        title: "Media approved",
        description: "The media item has been approved and is now visible to the public",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Approval failed",
        description: error.message || "There was an error approving the media item",
        variant: "destructive",
      });
    }
  });

  const rejectMediaMutation = useMutation({
    mutationFn: async (mediaId: string) => {
      const response = await apiRequest("PATCH", `/superadmin/media/${mediaId}/reject`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/superadmin/moderation/media'] });

      toast({
        title: "Media rejected",
        description: "The media item has been rejected",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Rejection failed",
        description: error.message || "There was an error rejecting the media item",
        variant: "destructive",
      });
    }
  });

  // Handle content actions
  const handleApproveStory = (story: Story) => {
    approveStoryMutation.mutate(story.id);
  };

  const handleRejectStory = (story: Story) => {
    rejectStoryMutation.mutate(story.id);
  };

  const handleApproveMedia = (media: MediaItem) => {
    approveMediaMutation.mutate(media.id);
  };

  const handleRejectMedia = (media: MediaItem) => {
    rejectMediaMutation.mutate(media.id);
  };

  const handlePreviewItem = (item: any) => {
    if (item) {
      console.log("Preview item:", item); // Debug log
      setSelectedItem(item);
      setPreviewDialogOpen(true);
    }
  };

  // Filter content by search query
  const filteredStories = Array.isArray(pendingStories)
    ? pendingStories.filter(
      (story: Story) => story.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const filteredMedia = Array.isArray(pendingMedia)
    ? pendingMedia.filter(
      (media: MediaItem) => media.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  // Loading state
  if (authLoading || storiesLoading || mediaLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse mb-4"></div>
        <div className="h-10 bg-muted rounded animate-pulse mb-6"></div>
        <div className="h-[500px] bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Content Moderation</h1>
          <p className="text-muted-foreground">Review and approve user-generated content</p>
        </div>

        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              className="pl-8 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="stories" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="stories">
            Stories {(pendingStories?.length ?? 0) > 0 && `(${pendingStories?.length ?? 0})`}
          </TabsTrigger>
          <TabsTrigger value="media">
            Media {Array.isArray(pendingMedia) && pendingMedia.length > 0 && `(${pendingMedia.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stories">
          <Card>
            <CardHeader>
              <CardTitle>Stories Pending Review</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredStories?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Museum</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStories.map((story: Story) => (
                      <TableRow key={story.id}>
                        <TableCell className="font-medium cursor-pointer hover:text-blue-600"
                          onClick={() => handlePreviewItem(story)}
                          title="Click to preview">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                            {story.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          {museums?.find(museum => museum.id === story.museumId)?.name || `Museum ID: ${story.museumId}`}
                        </TableCell>
                        <TableCell>
                          {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={story.isApproved === true ? "default" : story.isApproved === false ? "destructive" : "outline"}
                            className={story.isApproved === true ? "bg-green-100 text-green-800 border-green-200" :
                              story.isApproved === false ? "bg-red-100 text-red-800 border-red-200" :
                                "bg-yellow-100 text-yellow-800 border-yellow-200"}>
                            {story.isApproved === true ? "Approved" :
                              story.isApproved === false ? "Rejected" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {story.tags?.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {story.isApproved !== true && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleApproveStory(story)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            {story.isApproved !== false && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectStory(story)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No stories pending moderation</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Media Items Pending Review</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredMedia?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Museum</TableHead>
                      <TableHead>Gallery</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedia.map((media: MediaItem) => (
                      <TableRow key={media.id}>
                        <TableCell className="font-medium cursor-pointer hover:text-blue-600"
                          onClick={() => handlePreviewItem(media)}
                          title="Click to preview">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                            {media.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {media.mediaType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {museums?.find((museum: Museum) => museum.id === media.museumId)?.name || `Museum ID: ${media.museumId}`}
                        </TableCell>
                        <TableCell>
                          {media.galleryId || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={media.isApproved === true ? "default" : media.isApproved === false ? "destructive" : "outline"}
                            className={media.isApproved === true ? "bg-green-100 text-green-800 border-green-200" :
                              media.isApproved === false ? "bg-red-100 text-red-800 border-red-200" :
                                "bg-yellow-100 text-yellow-800 border-yellow-200"}>
                            {media.isApproved === true ? "Approved" :
                              media.isApproved === false ? "Rejected" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {media.isApproved !== true && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleApproveMedia(media)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            {media.isApproved !== false && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectMedia(media)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No media items pending moderation</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onOpenChange={(open) => {
          setPreviewDialogOpen(open);
          if (!open) setSelectedItem(null); // Reset selectedItem when dialog closes
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Preview</DialogTitle>
            <DialogDescription>
              Review this content before approving or rejecting
            </DialogDescription>
          </DialogHeader>

          {!selectedItem ? (
            <div className="p-6 bg-muted rounded-md flex items-center justify-center">
              <Info className="h-6 w-6 mr-2 text-muted-foreground" />
              <span>No item selected</span>
            </div>
          ) : 'content' in selectedItem ? (
            // Story preview
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-xl font-bold">{selectedItem.title || 'Untitled'}</h3>
                {selectedItem.summary && (
                  <p className="text-muted-foreground mt-1">{selectedItem.summary}</p>
                )}
              </div>

              {selectedItem.featuredImageUrl && (
                <div className="aspect-video relative overflow-hidden rounded-md">
                  <img
                    src={selectedItem.featuredImageUrl}
                    alt={selectedItem.title || 'Story image'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="prose prose-sm max-w-none">
                {selectedItem.content && (
                  <div dangerouslySetInnerHTML={{ __html: selectedItem.content }} />
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {selectedItem.tags && Array.isArray(selectedItem.tags) && selectedItem.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ) : 'url' in selectedItem ? (
            // Media preview
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-xl font-bold">{selectedItem.title || 'Untitled'}</h3>
                {selectedItem.description && (
                  <p className="text-muted-foreground mt-1">{selectedItem.description}</p>
                )}
              </div>

              <div className="flex justify-center">
                {selectedItem.mediaType && selectedItem.url ? (
                  selectedItem.mediaType.includes('image') ? (
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.title || 'Media image'}
                      className="max-h-[500px] object-contain"
                    />
                  ) : selectedItem.mediaType.includes('video') ? (
                    <video
                      src={selectedItem.url}
                      controls
                      className="max-h-[500px] w-full"
                    />
                  ) : selectedItem.mediaType.includes('audio') ? (
                    <audio
                      src={selectedItem.url}
                      controls
                      className="w-full"
                    />
                  ) : (
                    <div className="p-6 bg-muted rounded-md flex items-center justify-center">
                      <Info className="h-6 w-6 mr-2 text-muted-foreground" />
                      <span>Preview not available for this media type</span>
                    </div>
                  )
                ) : (
                  <div className="p-6 bg-muted rounded-md flex items-center justify-center">
                    <Info className="h-6 w-6 mr-2 text-muted-foreground" />
                    <span>Media URL not available</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {selectedItem.tags && Array.isArray(selectedItem.tags) && selectedItem.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <p>No content to preview</p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPreviewDialogOpen(false)}
            >
              Close
            </Button>

            {!selectedItem ? null : 'content' in selectedItem ? (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleRejectStory(selectedItem);
                    setPreviewDialogOpen(false);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    handleApproveStory(selectedItem);
                    setPreviewDialogOpen(false);
                  }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </>
            ) : 'url' in selectedItem ? (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleRejectMedia(selectedItem);
                    setPreviewDialogOpen(false);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    handleApproveMedia(selectedItem);
                    setPreviewDialogOpen(false);
                  }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}