"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MediaItem } from "../../../../badagry_backend/types/MediaItem";
import { formatDate } from "@/lib/utils";
import {
  Image,
  Video,
  FileAudio,
  File,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Upload,
  Grid3X3,
  List,
  Calendar,
  Tag
} from "lucide-react";

function MediaManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch media items for the museum
  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ['/media-items', user?.museumId],
    enabled: !!user?.museumId
  });

  // Upload media mutation
  const uploadMediaMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/media-items", { ...data, museumId: user?.museumId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/media-items'] });
      setIsUploadDialogOpen(false);
      toast({
        title: "Media uploaded",
        description: "Media item has been uploaded successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload media. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update media mutation
  const updateMediaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PATCH", `/media-items/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/media-items'] });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      toast({
        title: "Media updated",
        description: "Media item has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update media. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete media mutation
  const deleteMediaMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/media-items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/media-items'] });
      toast({
        title: "Media deleted",
        description: "Media item has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete media. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      url: formData.get('url') as string,
      mediaType: formData.get('mediaType') as string,
      description: formData.get('description') as string,
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean),
      galleryId: formData.get('galleryId') as string || null,
    };
    uploadMediaMutation.mutate(data);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      url: formData.get('url') as string,
      mediaType: formData.get('mediaType') as string,
      description: formData.get('description') as string,
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean),
      galleryId: formData.get('galleryId') as string || null,
    };
    updateMediaMutation.mutate({ id: selectedItem.id, data });
  };

  const handleDeleteMedia = (mediaId: string) => {
    if (window.confirm("Are you sure you want to delete this media item?")) {
      deleteMediaMutation.mutate(mediaId);
    }
  };

  // Filter media items
  const mediaList = (mediaItems as MediaItem[]) || [];
  const filteredMedia = mediaList.filter((item: MediaItem) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesType = selectedType === "all" || item.mediaType === selectedType;
    return matchesSearch && matchesType;
  });

  // Calculate statistics
  const totalMedia = mediaList.length;
  const approvedMedia = mediaList.filter(item => item.isApproved).length;
  const pendingMedia = mediaList.filter(item => !item.isApproved).length;
  const mediaTypes = {
    image: mediaList.filter(item => item.mediaType === 'image').length,
    video: mediaList.filter(item => item.mediaType === 'video').length,
    audio: mediaList.filter(item => item.mediaType === 'audio').length,
    document: mediaList.filter(item => item.mediaType === 'document').length,
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <FileAudio className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const getMediaTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-green-100 text-green-800 border-green-200';
      case 'video': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'audio': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-muted text-foreground border-border';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-primary flex items-center gap-2">
            <Image className="h-6 w-6" />
            Media Library
          </h1>
          <p className="text-muted-foreground">Manage your museum's digital media collection</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Media</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Media title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mediaType">Media Type</Label>
                  <Select name="mediaType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Media URL</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  placeholder="https://example.com/media.jpg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe this media item..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="art, sculpture, ancient"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="galleryId">Gallery ID (optional)</Label>
                  <Input
                    id="galleryId"
                    name="galleryId"
                    placeholder="gallery-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploadMediaMutation.isPending}>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadMediaMutation.isPending ? 'Uploading...' : 'Upload Media'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Media</p>
                <p className="text-2xl font-bold">{totalMedia}</p>
              </div>
              <Image className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{approvedMedia}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingMedia}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Media Types</p>
                <div className="flex gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">IMG: {mediaTypes.image}</Badge>
                  <Badge variant="outline" className="text-xs">VID: {mediaTypes.video}</Badge>
                </div>
              </div>
              <Tag className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid/List */}
      <Card>
        <CardContent className="p-6">
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No media items found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedType !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Start by uploading your first media item."}
              </p>
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMedia.map((item: MediaItem) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {item.mediaType === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className="hidden flex-col items-center justify-center text-muted-foreground">
                      {getMediaIcon(item.mediaType)}
                      <span className="text-sm mt-2 capitalize">{item.mediaType}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm truncate flex-1">{item.title}</h3>
                      <Badge
                        variant="outline"
                        className={`ml-2 text-xs ${getMediaTypeColor(item.mediaType)}`}
                      >
                        {getMediaIcon(item.mediaType)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {item.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant={item.isApproved ? "default" : "secondary"} className="text-xs">
                        {item.isApproved ? "Approved" : "Pending"}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMedia(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMedia.map((item: MediaItem) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0">
                      {getMediaIcon(item.mediaType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.description || "No description"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getMediaTypeColor(item.mediaType)}`}
                      >
                        {item.mediaType}
                      </Badge>
                      <Badge variant={item.isApproved ? "default" : "secondary"} className="text-xs">
                        {item.isApproved ? "Approved" : "Pending"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMedia(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Media Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Media Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editTitle">Title</Label>
                  <Input
                    id="editTitle"
                    name="title"
                    defaultValue={selectedItem.title}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editMediaType">Media Type</Label>
                  <Select name="mediaType" defaultValue={selectedItem.mediaType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUrl">Media URL</Label>
                <Input
                  id="editUrl"
                  name="url"
                  type="url"
                  defaultValue={selectedItem.url}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  name="description"
                  defaultValue={selectedItem.description || ""}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editTags">Tags (comma-separated)</Label>
                  <Input
                    id="editTags"
                    name="tags"
                    defaultValue={selectedItem.tags?.join(', ') || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editGalleryId">Gallery ID</Label>
                  <Input
                    id="editGalleryId"
                    name="galleryId"
                    defaultValue={selectedItem.galleryId || ""}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMediaMutation.isPending}>
                  <Edit className="h-4 w-4 mr-2" />
                  {updateMediaMutation.isPending ? 'Updating...' : 'Update Media'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MediaManagement;