"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { mediaTypes } from "@/lib/utils";
import { X, Upload, Image, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { MediaItem } from "@/types";

interface MediaUploaderProps {
  museumId?: string;
  onSuccess?: () => void;
  galleries?: any[] | MediaItem[];
}

export default function MediaUploader({
  museumId,
  onSuccess,
  galleries = [],
}: MediaUploaderProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [selectedGallery, setSelectedGallery] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // File upload state
  const [file, setFile] = useState<File | null>(null);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: {
      title: string;
      description: string;
      mediaType: string;
      museumId: string;
      galleryId?: string;
      tags?: string[];
      file: File;
    }) => {
      // Upload to Cloudinary first
      const cloudinaryResponse = await uploadToCloudinary(
        formData.file,
        formData.mediaType
      );

      // Then save metadata to your database
      const mediaData = {
        title: formData.title,
        description: formData.description,
        mediaType: formData.mediaType,
        museumId: formData.museumId,
        url: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
        format: cloudinaryResponse.format,
        width: cloudinaryResponse.width,
        height: cloudinaryResponse.height,
        ...(formData.galleryId && { galleryId: formData.galleryId }),
        ...(formData.tags &&
          formData.tags.length > 0 && { tags: formData.tags }),
      };

      const response = await apiRequest(
        "POST",
        "/admin/media/upload",
        mediaData
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/admin/media"] });
      toast.success("Your media has been successfully uploaded");
      resetForm();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error("Upload error:", error);
      toast.error(
        error.message || "Failed to upload the media. Please try again."
      );
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMediaType("image");
    setSelectedGallery("");
    setTags([]);
    setTagInput("");
    setFile(null);
    setFilePreview(null);
    setUploadError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    handleFile(selectedFile);
  };

  const handleFile = (selectedFile?: File | null) => {
    setUploadError(null);

    if (!selectedFile) {
      return;
    }

    // Validate file type based on selected media type
    const isImage = selectedFile.type.startsWith("image/");
    const isVideo = selectedFile.type.startsWith("video/");
    const isAudio = selectedFile.type.startsWith("audio/");

    if (
      (mediaType === "image" && !isImage) ||
      (mediaType === "video" && !isVideo) ||
      (mediaType === "audio" && !isAudio)
    ) {
      setUploadError(`Invalid file type. Please upload a ${mediaType} file.`);
      return;
    }

    // Validate file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError("File size too large. Maximum size is 10MB.");
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For non-images, just show the file name
      setFilePreview(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();

      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }

      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Cloudinary upload function
  const uploadToCloudinary = async (file: File, resourceType: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload to Cloudinary");
      }

      return await response.json();
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setUploadError("Please select a file to upload");
      return;
    }

    if (!title.trim()) {
      setUploadError("Please provide a title");
      return;
    }

    if (!museumId) {
      setUploadError("Museum ID is required");
      return;
    }

    const uploadData = {
      file,
      title,
      description,
      mediaType,
      museumId: museumId.toString(),
      ...(selectedGallery &&
        selectedGallery !== "no-gallery" && { galleryId: selectedGallery }),
      ...(tags.length > 0 && { tags }),
    };

    uploadMutation.mutate(uploadData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div
            className={`h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border"
            } ${uploadError ? "border-destructive" : ""}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {filePreview ? (
              <div className="relative w-full h-full p-2">
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setFilePreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={
                    mediaType === "image"
                      ? "image/*"
                      : mediaType === "video"
                      ? "video/*"
                      : "audio/*"
                  }
                />
                <div className="text-center">
                  {uploadError ? (
                    <AlertCircle className="h-10 w-10 mx-auto text-destructive mb-2" />
                  ) : (
                    <>
                      {mediaType === "image" ? (
                        <Image className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      ) : (
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      )}
                    </>
                  )}
                  {uploadError ? (
                    <p className="text-sm text-destructive mb-1">
                      {uploadError}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-1">
                      {file
                        ? file.name
                        : `Drag and drop your ${mediaType} here, or click to browse`}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Max file size: 10MB
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="media-type">Media Type</Label>
              <Select value={mediaType} onValueChange={setMediaType}>
                <SelectTrigger id="media-type">
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  {mediaTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gallery">Gallery (optional)</Label>
              <Select
                value={selectedGallery}
                onValueChange={setSelectedGallery}
              >
                <SelectTrigger id="gallery">
                  <SelectValue placeholder="Select a gallery" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-gallery">No Gallery</SelectItem>
                  {galleries.map((gallery) => (
                    <SelectItem key={gallery.id} value={gallery.id}>
                      {gallery.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your media"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide a brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <div className="space-y-2">
              <Input
                id="tags"
                placeholder="Add tags and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
              />

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button
                        type="button"
                        className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        onClick={() => handleTagRemove(tag)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={resetForm}>
          Reset
        </Button>
        <Button type="submit" disabled={uploadMutation.isPending || !file}>
          {uploadMutation.isPending ? "Uploading..." : "Upload Media"}
        </Button>
      </div>
    </form>
  );
}
