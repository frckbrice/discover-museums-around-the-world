"use client";

import { useState, useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Event } from "../../../../badagry_backend/types/Event";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, MapPin, Plus, Edit, Trash2, Search, Eye } from "lucide-react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

function EventsManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [location, setLocation] = useState("");

  // Check if we should auto-open the create dialog based on the URL
  useEffect(() => {
    if (pathname === '/admin/events/new') {
      setIsCreateDialogOpen(true);
      // Navigate back to /admin/events to clean up the URL
      setLocation('/admin/events');
    }
  }, [location, setLocation]);

  // Fetch events for the museum
  const { data: events, isLoading } = useQuery({
    queryKey: ['/events', user?.museumId],
    enabled: !!user?.museumId
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: (eventData: any) => apiRequest("POST", "/events", eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/events'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Event created",
        description: "The event has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<Event> }) =>
      apiRequest("PATCH", `/events/${data.id}`, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/events'] });
      setIsEditDialogOpen(false);
      setSelectedEvent(null);
      toast({
        title: "Event updated",
        description: "The event has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => apiRequest("DELETE", `/events/${eventId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/events'] });
      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const eventData: any = {
      museumId: user!.museumId!,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      eventDate: new Date(formData.get("eventDate") as string),
      endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : undefined,
      location: formData.get("location") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
      isPublished: formData.get("isPublished") === "on",
      isApproved: true // Auto-approve for museum admins
    };

    createEventMutation.mutate(eventData);
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const formData = new FormData(e.target as HTMLFormElement);

    const updates: Partial<Event> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      eventDate: new Date(formData.get("eventDate") as string),
      endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : undefined,
      location: formData.get("location") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
      isPublished: formData.get("isPublished") === "on"
    };

    updateEventMutation.mutate({ id: selectedEvent.id, updates });
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEventMutation.mutate(eventId);
    }
  };

  const filteredEvents = Array.isArray(events) ? events.filter((event: Event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const upcomingEvents = filteredEvents.filter((event: Event) =>
    new Date(event.eventDate) > new Date()
  ).length;

  const publishedEvents = filteredEvents.filter((event: Event) => event.isPublished).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-primary">Events Management</h1>
          <p className="text-muted-foreground mt-1">Manage your museum's events and activities</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Add a new event or activity for your museum
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" required />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventDate">Start Date & Time</Label>
                  <Input id="eventDate" name="eventDate" type="datetime-local" required />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date & Time (Optional)</Label>
                  <Input id="endDate" name="endDate" type="datetime-local" />
                </div>
              </div>

              <div>
                <Label htmlFor="imageUrl">Event Image URL (Optional)</Label>
                <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isPublished" name="isPublished" />
                <Label htmlFor="isPublished">Publish immediately</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createEventMutation.isPending}>
                  {createEventMutation.isPending ? "Creating..." : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{filteredEvents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                <p className="text-2xl font-bold">{upcomingEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{publishedEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">No events</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating your first event.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event: Event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {event.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(event.eventDate)}</p>
                        {event.endDate && (
                          <p className="text-muted-foreground">
                            to {formatDate(event.endDate)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant={event.isPublished ? "default" : "secondary"}>
                          {event.isPublished ? "Published" : "Draft"}
                        </Badge>
                        {new Date(event.eventDate) > new Date() && (
                          <Badge variant="outline">Upcoming</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update event information
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <form onSubmit={handleUpdateEvent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Event Title</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={selectedEvent.title}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    name="location"
                    defaultValue={selectedEvent.location}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  rows={3}
                  defaultValue={selectedEvent.description}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-eventDate">Start Date & Time</Label>
                  <Input
                    id="edit-eventDate"
                    name="eventDate"
                    type="datetime-local"
                    defaultValue={new Date(selectedEvent.eventDate).toISOString().slice(0, 16)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-endDate">End Date & Time (Optional)</Label>
                  <Input
                    id="edit-endDate"
                    name="endDate"
                    type="datetime-local"
                    defaultValue={selectedEvent.endDate
                      ? new Date(selectedEvent.endDate).toISOString().slice(0, 16)
                      : ""
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-imageUrl">Event Image URL (Optional)</Label>
                <Input
                  id="edit-imageUrl"
                  name="imageUrl"
                  type="url"
                  defaultValue={selectedEvent.imageUrl || ""}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isPublished"
                  name="isPublished"
                  defaultChecked={!!selectedEvent.isPublished}
                />
                <Label htmlFor="edit-isPublished">Published</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateEventMutation.isPending}>
                  {updateEventMutation.isPending ? "Updating..." : "Update Event"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EventsManagement;