"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useGallery } from "@/hooks/useGallery";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import MediaUploader from "@/components/editor/MediaUploader";
import { formatDate } from "@/lib/utils";

export default function GalleryManagement() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGallery, setSelectedGallery] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mediaItemToDelete, setMediaItemToDelete] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editMediaItem, setEditMediaItem] = useState<any>(null);

  // Get galleries for filter
  const {
    data: galleries,
    isLoading: isGalleriesLoading
  } = useQuery<any[]>({
    queryKey: ['/admin/galleries'],
    enabled: isAuthenticated && !!user?.museumId
  });

  // Get common tags
  const {
    data: allTags,
    isLoading: isTagsLoading
  } = useQuery<string[]>({
    queryKey: ['/admin/media/tags'],
    enabled: isAuthenticated && !!user?.museumId
  });

  // Get media items
  const {
    mediaItems,
    isLoading: isMediaLoading,
    refetch: refetchMedia
  } = useGallery({
    museumId: user?.museumId,
    galleryId: selectedGallery !== "all" ? selectedGallery : undefined,
    searchQuery,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  });

  // Mutation for deleting media
  const deleteMediaMutation = useMutation({
    mutationFn: (mediaId: string) => apiRequest("DELETE", `/admin/media-items/${mediaId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/admin/media-items'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Media deleted",
        description: "The media item has been successfully deleted.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete the media. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Mutation for updating media
  const updateMediaMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", `/admin/media-items/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/admin/media-items'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Media updated",
        description: "The media item has been successfully updated.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update the media. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const handleDeleteMedia = (mediaId: string) => {
    setMediaItemToDelete(mediaId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (mediaItemToDelete) {
      deleteMediaMutation.mutate(mediaItemToDelete);
    }
  };

  const handleEditMedia = (media: any) => {
    setEditMediaItem(media);
    setIsEditDialogOpen(true);
  };

  const handleUpdateMedia = () => {
    if (editMediaItem) {
      updateMediaMutation.mutate(editMediaItem);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

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
          <h1 className="text-xl font-playfair font-bold text-primary">Gallery Management</h1>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-destructive text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                <path d="M12 12v9"></path>
                <path d="m16 16-4-4-4 4"></path>
              </svg>
              Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Upload New Media</DialogTitle>
              <DialogDescription>
                Add images, videos, or audio to your museum gallery.
              </DialogDescription>
            </DialogHeader>
            <MediaUploader
              museumId={user?.museumId}
              onSuccess={() => {
                setIsUploadDialogOpen(false);
                refetchMedia();
              }}
              galleries={galleries || []}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
            <div className="w-full md:w-1/3">
              <Input
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="w-full md:w-1/3">
              <Select value={selectedGallery} onValueChange={setSelectedGallery}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a gallery" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Galleries</SelectItem>
                  {!isGalleriesLoading && galleries && galleries?.map((gallery: any) => (
                    <SelectItem key={gallery.id} value={gallery.id}>
                      {gallery.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          {isTagsLoading ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          ) : allTags && allTags?.length > 0 ? (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Filter by tags:</p>
              <div className="flex flex-wrap gap-2">
                {allTags?.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="grid" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <rect width="7" height="7" x="3" y="3" rx="1"></rect>
              <rect width="7" height="7" x="14" y="3" rx="1"></rect>
              <rect width="7" height="7" x="14" y="14" rx="1"></rect>
              <rect width="7" height="7" x="3" y="14" rx="1"></rect>
            </svg>
            Grid View
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <line x1="8" x2="21" y1="6" y2="6"></line>
              <line x1="8" x2="21" y1="12" y2="12"></line>
              <line x1="8" x2="21" y1="18" y2="18"></line>
              <line x1="3" x2="3.01" y1="6" y2="6"></line>
              <line x1="3" x2="3.01" y1="12" y2="12"></line>
              <line x1="3" x2="3.01" y1="18" y2="18"></line>
            </svg>
            List View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          {isMediaLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="w-full h-64 rounded-md" />
              ))}
            </div>
          ) : mediaItems && mediaItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mediaItems.map(item => (
                <div key={item.id} className="group relative">
                  <div className="aspect-square bg-muted rounded-md overflow-hidden">
                    {item.mediaType === "image" ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : item.mediaType === "video" ? (
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polygon points="10 8 16 12 10 16 10 8"></polygon>
                          </svg>
                        </div>
                        <img
                          src={`https://placehold.co/400x400?text=Video:+${encodeURIComponent(item.title)}`}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-60"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-900">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-2">
                    <h3 className="font-medium text-primary truncate">{item.title}</h3>
                    {item.galleryId && (
                      <p className="text-xs text-muted-foreground">
                        Gallery: {galleries?.find((g: any) => g.id === item.galleryId)?.name || item.galleryId}
                      </p>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 rounded-md">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white text-primary hover:bg-primary hover:text-white"
                      onClick={() => handleEditMedia(item)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                        <path d="m15 5 4 4"></path>
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white text-destructive hover:bg-destructive hover:text-white"
                      onClick={() => handleDeleteMedia(item.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-white rounded-lg border border-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground mb-4">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
              <h3 className="text-xl font-playfair font-bold text-primary mb-2">No Media Found</h3>
              <p className="text-muted-foreground mb-6">
                Your gallery is empty. Upload some media to get started.
              </p>
              <Button
                onClick={() => setIsUploadDialogOpen(true)}
                className="bg-primary text-white"
              >
                Upload Media
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          {isMediaLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-full h-20 rounded-md" />
              ))}
            </div>
          ) : mediaItems && mediaItems.length > 0 ? (
            <div className="space-y-3">
              {mediaItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-md border border-muted flex items-center">
                  <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    {item.mediaType === "image" ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : item.mediaType === "video" ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-primary-900">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-900">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium text-primary">{item.title}</h3>
                    <p className="text-sm text-muted-foreground truncate max-w-lg">
                      {item.description || "No description"}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full mr-2">
                        {item.mediaType}
                      </span>
                      {item.galleryId && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          {galleries?.find((g: any) => g.id === item.galleryId)?.name || item.galleryId}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        Added: {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleEditMedia(item)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                        <path d="m15 5 4 4"></path>
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-white hover:bg-destructive"
                      onClick={() => handleDeleteMedia(item.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-white rounded-lg border border-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground mb-4">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
              <h3 className="text-xl font-playfair font-bold text-primary mb-2">No Media Found</h3>
              <p className="text-muted-foreground mb-6">
                Your gallery is empty. Upload some media to get started.
              </p>
              <Button
                onClick={() => setIsUploadDialogOpen(true)}
                className="bg-primary text-white"
              >
                Upload Media
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this media item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMediaMutation.isPending}
            >
              {deleteMediaMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Media Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
            <DialogDescription>
              Update the details of your media item.
            </DialogDescription>
          </DialogHeader>

          {editMediaItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editMediaItem.title}
                  onChange={(e) => setEditMediaItem({ ...editMediaItem, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editMediaItem.description || ""}
                  onChange={(e) => setEditMediaItem({ ...editMediaItem, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-gallery">Gallery</Label>
                <Select
                  value={editMediaItem.galleryId || ""}
                  onValueChange={(value) => setEditMediaItem({ ...editMediaItem, galleryId: value })}
                >
                  <SelectTrigger id="edit-gallery">
                    <SelectValue placeholder="Select a gallery" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-gallery">No Gallery</SelectItem>
                    {!isGalleriesLoading && galleries && galleries.map((gallery: any) => (
                      <SelectItem key={gallery.id} value={gallery.id}>
                        {gallery.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                  {!isTagsLoading && allTags && allTags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant={editMediaItem.tags && editMediaItem.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const currentTags = editMediaItem.tags || [];
                        const newTags = currentTags.includes(tag)
                          ? currentTags.filter((t: string) => t !== tag)
                          : [...currentTags, tag];
                        setEditMediaItem({ ...editMediaItem, tags: newTags });
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateMedia}
              disabled={updateMediaMutation.isPending}
            >
              {updateMediaMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
