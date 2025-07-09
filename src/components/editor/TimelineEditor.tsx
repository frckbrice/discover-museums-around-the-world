"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PlusCircle, X, ArrowUp, ArrowDown, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface TimelinePoint {
  id: string;
  date: string;
  title: string;
  description: string;
}

interface TimelineEditorProps {
  initialData?: {
    title: string;
    description?: string;
    timelinePoints: TimelinePoint[];
  };
  onSave: (data: any) => void;
}

export default function TimelineEditor({
  initialData,
  onSave
}: TimelineEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [timelinePoints, setTimelinePoints] = useState<TimelinePoint[]>(
    initialData?.timelinePoints || []
  );
  const [newPoint, setNewPoint] = useState<Partial<TimelinePoint>>({
    date: "",
    title: "",
    description: ""
  });


  const handleAddPoint = () => {
    if (!newPoint.date || !newPoint.title) {
      toast.error("Please provide both a date and title for the timeline point");
      return;
    }
    
    const point: TimelinePoint = {
      id: `point-${Date.now()}`,
      date: newPoint.date,
      title: newPoint.title,
      description: newPoint.description || ""
    };
    
    setTimelinePoints([...timelinePoints, point]);
    setNewPoint({ date: "", title: "", description: "" });
  };

  const handleRemovePoint = (id: string) => {
    setTimelinePoints(timelinePoints.filter(point => point.id !== id));
  };

  const handleMovePoint = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === timelinePoints.length - 1)
    ) {
      return;
    }
    
    const newPoints = [...timelinePoints];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    [newPoints[index], newPoints[targetIndex]] = [newPoints[targetIndex], newPoints[index]];
    
    setTimelinePoints(newPoints);
  };

  const handleSaveTimeline = () => {
    if (!title) {
      toast.error("Please provide a title for your timeline");
      return;
    }
    
    if (timelinePoints.length < 2) {
      toast.error("A timeline should have at least 2 points");
      return;
    }
    
    const timelineData = {
      title,
      description,
      timelinePoints: [...timelinePoints].sort((a, b) => {
        // Sort points by date if they are numeric (years)
        const aNum = parseInt(a.date);
        const bNum = parseInt(b.date);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        
        // Otherwise keep user-defined order
        return 0;
      })
    };
    
    onSave(timelineData);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="timeline-title">Timeline Title</Label>
          <Input
            id="timeline-title"
            placeholder="e.g., Evolution of Modern Art"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timeline-description">Description (optional)</Label>
          <Textarea
            id="timeline-description"
            placeholder="Provide a brief description of this timeline..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Timeline Points</h3>
        
        {timelinePoints.length > 0 ? (
          <div className="overflow-x-auto rounded-md border mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[200px]">Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timelinePoints.map((point, index) => (
                  <TableRow key={point.id}>
                    <TableCell className="font-medium">{point.date}</TableCell>
                    <TableCell>{point.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{point.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={index === 0}
                          onClick={() => handleMovePoint(index, "up")}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={index === timelinePoints.length - 1}
                          onClick={() => handleMovePoint(index, "down")}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleRemovePoint(point.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 mb-4 rounded-md border border-dashed text-center">
            <div>
              <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-2">No timeline points yet</p>
              <p className="text-sm text-muted-foreground">Add points using the form below</p>
            </div>
          </div>
        )}
        
        <div className="bg-muted rounded-md p-4">
          <h4 className="text-sm font-medium mb-3">Add New Point</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="point-date">Date or Period</Label>
              <Input
                id="point-date"
                placeholder="e.g., 1940s or May 1968"
                value={newPoint.date}
                onChange={(e) => setNewPoint({ ...newPoint, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="point-title">Title</Label>
              <Input
                id="point-title"
                placeholder="e.g., Abstract Expressionism"
                value={newPoint.title}
                onChange={(e) => setNewPoint({ ...newPoint, title: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="point-description">Description</Label>
              <Textarea
                id="point-description"
                placeholder="Describe this timeline point..."
                value={newPoint.description}
                onChange={(e) => setNewPoint({ ...newPoint, description: e.target.value })}
                rows={2}
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={handleAddPoint}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add Point
          </Button>
        </div>
      </div>
      
      <div className="border-t pt-4 flex justify-end">
        <Button onClick={handleSaveTimeline}>
          Save Timeline
        </Button>
      </div>
    </div>
  );
}
