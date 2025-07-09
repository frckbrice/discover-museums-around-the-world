"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading2, 
  Heading3, 
  Quote, 
  Link, 
  Image as ImageIcon,
  Video,
  Clock,
  ChevronDown,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import MediaUploader from "./MediaUploader";
import TimelineEditor from "./TimelineEditor";
import { useGallery } from "@/hooks/useGallery";
import { toast } from "sonner";

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
  onAddTimeline?: (timelineData: any) => void;
  museumId?: string;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  initialValue = "",
  onChange,
  onAddTimeline,
  museumId,
  placeholder = "Start typing your story...",
  minHeight = "300px"
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const { mediaItems, isLoading: isMediaLoading } = useGallery({ museumId });
  
  // Initialize editor with initial value
  useEffect(() => {
    if (editorRef.current && initialValue) {
      editorRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  // Handle editor content change
  const handleEditorChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Execute command on the editor
  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    handleEditorChange();
    editorRef.current?.focus();
  };

  // Handle formats (bold, italic, etc.)
  const handleFormat = (format: string) => {
    execCommand(format);
  };

  // Handle headings
  const handleHeading = (level: string) => {
    execCommand("formatBlock", level);
  };

  // Handle link insert
  const handleLinkInsert = () => {
    if (linkUrl.trim() === "") {
      toast.error("Please enter a valid URL");
      return;
    }

    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || linkUrl}</a>`;
    execCommand("insertHTML", linkHtml);
    setIsLinkDialogOpen(false);
    setLinkUrl("");
    setLinkText("");
  };

  // Handle media insert from gallery
  const handleMediaInsert = (mediaItem: any) => {
    if (!mediaItem) return;

    let mediaHtml = "";
    
    if (mediaItem.mediaType === "image") {
      mediaHtml = `<figure class="editor-image">
        <img src="${mediaItem.url}" alt="${mediaItem.title}" style="max-width: 100%; height: auto;" />
        <figcaption>${mediaItem.title}</figcaption>
      </figure>`;
    } else if (mediaItem.mediaType === "video") {
      mediaHtml = `<figure class="editor-video">
        <video src="${mediaItem.url}" controls style="max-width: 100%; height: auto;"></video>
        <figcaption>${mediaItem.title}</figcaption>
      </figure>`;
    } else if (mediaItem.mediaType === "audio") {
      mediaHtml = `<figure class="editor-audio">
        <audio src="${mediaItem.url}" controls></audio>
        <figcaption>${mediaItem.title}</figcaption>
      </figure>`;
    }

    execCommand("insertHTML", mediaHtml);
    setIsMediaDialogOpen(false);
  };

  // Handle timeline insert
  const handleTimelineInsert = (timelineData: any) => {
    // Create a placeholder for the timeline in the editor
    const timelineId = `timeline-${Date.now()}`;
    const timelinePlaceholder = `<div class="editor-timeline" data-timeline-id="${timelineId}">
      <div style="padding: 1rem; background-color: #f1f5f9; border-radius: 0.5rem; border: 1px dashed #64748b;">
        <h3 style="font-weight: bold; margin-bottom: 0.5rem;">Timeline: ${timelineData.title}</h3>
        <p style="font-size: 0.875rem; color: #64748b;">${timelineData.timelinePoints.length} timeline points</p>
        <p style="font-style: italic; font-size: 0.875rem;">[This timeline will be displayed in the published version]</p>
      </div>
    </div>`;
    
    execCommand("insertHTML", timelinePlaceholder);
    
    // Pass the timeline data to parent component
    if (onAddTimeline) {
      onAddTimeline({
        ...timelineData,
        id: timelineId
      });
    }
    
    setIsTimelineDialogOpen(false);
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-border rounded-md mb-2">
        <div className="flex flex-wrap items-center p-2 border-b border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleFormat("bold")}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleFormat("italic")}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <div className="h-4 border-r border-border mx-1"></div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Heading2 className="h-4 w-4 mr-1" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleHeading("h2")}>
                <Heading2 className="h-4 w-4 mr-2" /> Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleHeading("h3")}>
                <Heading3 className="h-4 w-4 mr-2" /> Heading 3
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleHeading("p")}>
                <span className="h-4 w-4 mr-2 flex items-center justify-center">P</span> Paragraph
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="h-4 border-r border-border mx-1"></div>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleFormat("insertUnorderedList")}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleFormat("insertOrderedList")}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand("formatBlock", "blockquote")}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          
          <div className="h-4 border-r border-border mx-1"></div>
          
          <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm" title="Insert Link">
                <Link className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Link</DialogTitle>
                <DialogDescription>
                  Add a link to your content
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text">Link Text (optional)</Label>
                  <Input
                    id="text"
                    placeholder="Click here"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsLinkDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleLinkInsert}>Insert Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm" title="Insert Media">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Insert Media</DialogTitle>
                <DialogDescription>
                  Choose media from your gallery to insert
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex gap-4 mb-4">
                <Button
                  variant={mediaType === "image" ? "default" : "outline"}
                  onClick={() => setMediaType("image")}
                  className="flex-1"
                >
                  <ImageIcon className="h-4 w-4 mr-2" /> Images
                </Button>
                <Button
                  variant={mediaType === "video" ? "default" : "outline"}
                  onClick={() => setMediaType("video")}
                  className="flex-1"
                >
                  <Video className="h-4 w-4 mr-2" /> Videos
                </Button>
              </div>
              
              {isMediaLoading ? (
                <div className="text-center py-8">
                  <p>Loading media...</p>
                </div>
              ) : mediaItems && mediaItems.length > 0 ? (
                <div className="grid grid-cols-3 gap-4 max-h-80 overflow-y-auto py-2">
                  {mediaItems
                    .filter(item => item.mediaType === mediaType)
                    .map(item => (
                      <Card 
                        key={item.id} 
                        className="cursor-pointer hover:border-primary"
                        onClick={() => handleMediaInsert(item)}
                      >
                        <CardContent className="p-2">
                          <div className="aspect-square bg-muted rounded-md overflow-hidden mb-2">
                            {item.mediaType === "image" ? (
                              <img 
                                src={item.url} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="relative w-full h-full flex items-center justify-center bg-primary-900">
                                <Video className="h-8 w-8 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-medium truncate">{item.title}</p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No media found. Upload media in Gallery Management first.</p>
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsMediaDialogOpen(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {onAddTimeline && (
            <Dialog open={isTimelineDialogOpen} onOpenChange={setIsTimelineDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="ghost" size="sm" title="Insert Timeline">
                  <Clock className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Timeline</DialogTitle>
                  <DialogDescription>
                    Create an interactive timeline to illustrate historical events
                  </DialogDescription>
                </DialogHeader>
                
                <TimelineEditor onSave={handleTimelineInsert} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div
          ref={editorRef}
          className="p-4 outline-none"
          contentEditable
          style={{ minHeight }}
          onInput={handleEditorChange}
          onBlur={handleEditorChange}
          data-placeholder={placeholder}
        ></div>
      </div>
    </div>
  );
}
