// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import { apiRequest } from "@/lib/queryClient";
// import { useToast } from "@/hooks/use-toast";
// import { Museum } from "@/types";
// import { Check, X, Search, Plus } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function MuseumManagement() {
//   const router = useRouter()
//   const { user, isAuthenticated, isLoading: authLoading } = useAuth();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

//   // Redirect if not authenticated or not super admin
//   useEffect(() => {
//     if (!authLoading && (!isAuthenticated || user?.role !== "super_admin")) {
//       router.push("/admin/login");
//     }
//   }, [authLoading, isAuthenticated, router, user]);

//   // Fetch museums with different approval statuses
//   const { data: pendingMuseums, isLoading: pendingLoading } = useQuery<Museum[]>({
//     queryKey: ['/superadmin/museums', { approved: false }],
//     enabled: isAuthenticated && user?.role === "super_admin",
//   });

//   const { data: approvedMuseums, isLoading: approvedLoading } = useQuery<Museum[]>({
//     queryKey: ['/superadmin/museums', { approved: true }],
//     enabled: isAuthenticated && user?.role === "super_admin",
//   });

//   // Mutations for museum actions
//   const approveMuseumMutation = useMutation({
//     mutationFn: async (museumId: string) => {
//       const response = await apiRequest("PATCH", `/superadmin/museums/${museumId}/approve`, {});
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['/superadmin/museums'] });

//       toast({
//         title: "Museum approved",
//         description: "The museum has been approved and is now active",
//         variant: "default",
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Approval failed",
//         description: error.message || "There was an error approving the museum",
//         variant: "destructive",
//       });
//     }
//   });

//   const rejectMuseumMutation = useMutation({
//     mutationFn: async (museumId: string) => {
//       const response = await apiRequest("PATCH", `/superadmin/museums/${museumId}/reject`, {});
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['/superadmin/museums'] });

//       toast({
//         title: "Museum rejected",
//         description: "The museum has been rejected",
//         variant: "default",
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Rejection failed",
//         description: error.message || "There was an error rejecting the museum",
//         variant: "destructive",
//       });
//     }
//   });

//   const updateMuseumStatusMutation = useMutation({
//     mutationFn: async ({ museumId, isActive }: { museumId: string; isActive: boolean }) => {
//       const response = await apiRequest("PATCH", `/superadmin/museums/${museumId}`, {
//         isActive
//       });
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['/superadmin/museums'] });

//       toast({
//         title: "Status updated",
//         description: "Museum status has been updated successfully",
//         variant: "default",
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Update failed",
//         description: error.message || "There was an error updating the museum status",
//         variant: "destructive",
//       });
//     }
//   });

//   const updateMuseumMutation = useMutation({
//     mutationFn: async (data: Partial<Museum> & { id: string }) => {
//       const response = await apiRequest("PATCH", `/superadmin/museums/${data.id}`, data);
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['/superadmin/museums'] });
//       setIsEditDialogOpen(false);

//       toast({
//         title: "Museum updated",
//         description: "Museum details have been updated successfully",
//         variant: "default",
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Update failed",
//         description: error.message || "There was an error updating the museum",
//         variant: "destructive",
//       });
//     }
//   });

//   // Handle museum actions
//   const handleApproveMuseum = (museum: Museum) => {
//     approveMuseumMutation.mutate(museum.id);
//   };

//   const handleRejectMuseum = (museum: Museum) => {
//     rejectMuseumMutation.mutate(museum.id);
//   };

//   const handleStatusToggle = (museum: Museum, isActive: boolean) => {
//     updateMuseumStatusMutation.mutate({ museumId: museum.id, isActive });
//   };

//   const handleEditMuseum = (museum: Museum) => {
//     setSelectedMuseum(museum);
//     setIsEditDialogOpen(true);
//   };

//   const handleUpdateMuseum = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!selectedMuseum) return;

//     const formElement = e.target as HTMLFormElement;
//     const formData = new FormData(formElement);

//     const data = {
//       id: selectedMuseum.id,
//       name: formData.get("name") as string,
//       description: formData.get("description") as string,
//       location: formData.get("location") as string,
//       city: formData.get("city") as string,
//       country: formData.get("country") as string,
//       website: formData.get("website") as string || null,
//       logoUrl: formData.get("logoUrl") as string || null,
//       featuredImageUrl: formData.get("featuredImageUrl") as string || null,
//     };

//     updateMuseumMutation.mutate(data);
//   };

//   // Filter museums by search query
//   const filteredPendingMuseums = pendingMuseums?.filter(
//     (museum: Museum) => museum.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const filteredApprovedMuseums = approvedMuseums?.filter(
//     (museum: Museum) => museum.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Loading state
//   if (authLoading || pendingLoading || approvedLoading) {
//     return (
//       <div className="p-6 space-y-6">
//         <div className="flex items-center justify-between">
//           <Skeleton className="h-8 w-64" />
//           <Skeleton className="h-10 w-64" />
//         </div>

//         <Skeleton className="h-12 w-full" />

//         <Skeleton className="h-[500px] w-full" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-primary">Museum Management</h1>
//           <p className="text-muted-foreground">Manage museum accounts and content</p>
//         </div>

//         <div className="w-full md:w-auto flex items-center gap-2">
//           <div className="relative w-full md:w-64">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search museums..."
//               className="pl-8"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <Button>
//             <Plus className="h-4 w-4 mr-2" />
//             Add Museum
//           </Button>
//         </div>
//       </div>

//       <Tabs defaultValue="pending" className="w-full">
//         <TabsList className="mb-4">
//           <TabsTrigger value="pending">
//             Pending Approval {(pendingMuseums?.length ?? 0) > 0 && `(${pendingMuseums?.length ?? 0})`}
//           </TabsTrigger>
//           <TabsTrigger value="approved">
//             Approved Museums
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="pending">
//           <Card>
//             <CardContent className="p-0">
//               {(filteredPendingMuseums ?? []).length > 0 ? (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Name</TableHead>
//                       <TableHead>Location</TableHead>
//                       <TableHead>Type</TableHead>
//                       <TableHead>Contact</TableHead>
//                       <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {(filteredPendingMuseums ?? []).map((museum: Museum) => (
//                       <TableRow key={museum.id}>
//                         <TableCell className="font-medium">
//                           <div className="flex items-center gap-2">
//                             {museum.logoUrl ? (
//                               <img
//                                 src={museum.logoUrl}
//                                 alt={museum.name}
//                                 className="w-8 h-8 rounded-full object-cover"
//                               />
//                             ) : (
//                               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
//                                 {museum.name.charAt(0)}
//                               </div>
//                             )}
//                             {museum.name}
//                           </div>
//                         </TableCell>
//                         <TableCell>{museum.city}, {museum.country}</TableCell>
//                         <TableCell>
//                           <Badge variant="outline">
//                             {museum.museumType || "General"}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>{museum.website || "—"}</TableCell>
//                         <TableCell className="text-right">
//                           <div className="flex items-center justify-end gap-2">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleEditMuseum(museum)}
//                             >
//                               Edit
//                             </Button>
//                             <Button
//                               variant="default"
//                               size="sm"
//                               onClick={() => handleApproveMuseum(museum)}
//                               className="bg-green-600 hover:bg-green-700 text-white"
//                             >
//                               <Check className="h-4 w-4 mr-1" />
//                               Approve
//                             </Button>
//                             <Button
//                               variant="destructive"
//                               size="sm"
//                               onClick={() => handleRejectMuseum(museum)}
//                             >
//                               <X className="h-4 w-4 mr-1" />
//                               Reject
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               ) : (
//                 <div className="py-12 text-center">
//                   <p className="text-muted-foreground">No pending museums found</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="approved">
//           <Card>
//             <CardContent className="p-0">
//               {(filteredApprovedMuseums || [])?.length > 0 ? (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Name</TableHead>
//                       <TableHead>Location</TableHead>
//                       <TableHead>Type</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Content</TableHead>
//                       <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {(filteredApprovedMuseums || []).map((museum: Museum) => (
//                       <TableRow key={museum.id}>
//                         <TableCell className="font-medium">
//                           <div className="flex items-center gap-2">
//                             {museum.logoUrl ? (
//                               <img
//                                 src={museum.logoUrl}
//                                 alt={museum.name}
//                                 className="w-8 h-8 rounded-full object-cover"
//                               />
//                             ) : (
//                               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
//                                 {museum.name.charAt(0)}
//                               </div>
//                             )}
//                             {museum.name}
//                           </div>
//                         </TableCell>
//                         <TableCell>{museum.city}, {museum.country}</TableCell>
//                         <TableCell>
//                           <Badge variant="outline">
//                             {museum.museumType || "General"}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex items-center gap-2">
//                             <Switch
//                               checked={museum.isActive === true}
//                               onCheckedChange={(checked) => handleStatusToggle(museum, checked)}
//                             />
//                             <span className={museum.isActive ? "text-green-600" : "text-muted-foreground"}>
//                               {museum.isActive ? "Active" : "Inactive"}
//                             </span>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex items-center gap-1">
//                             <Badge className="bg-blue-500 hover:bg-blue-600">Stories</Badge>
//                             <Badge className="bg-purple-500 hover:bg-purple-600">Gallery</Badge>
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <div className="flex items-center justify-end gap-2">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleEditMuseum(museum)}
//                             >
//                               Edit
//                             </Button>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => router.push(`/museums/${museum.id}`)}
//                             >
//                               View
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               ) : (
//                 <div className="py-12 text-center">
//                   <p className="text-muted-foreground">No approved museums found</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Edit Museum Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="max-w-xl">
//           <DialogHeader>
//             <DialogTitle>Edit Museum Details</DialogTitle>
//             <DialogDescription>
//               Update the museum information
//             </DialogDescription>
//           </DialogHeader>

//           {selectedMuseum && (
//             <form onSubmit={handleUpdateMuseum}>
//               <div className="grid grid-cols-1 gap-4 py-4">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="name" className="text-right">
//                     Name
//                   </Label>
//                   <Input
//                     id="name"
//                     name="name"
//                     defaultValue={selectedMuseum.name}
//                     className="col-span-3"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-4 items-start gap-4">
//                   <Label htmlFor="description" className="text-right pt-2">
//                     Description
//                   </Label>
//                   <textarea
//                     id="description"
//                     name="description"
//                     defaultValue={selectedMuseum.description}
//                     rows={3}
//                     className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="location" className="text-right">
//                     Address
//                   </Label>
//                   <Input
//                     id="location"
//                     name="location"
//                     defaultValue={selectedMuseum.location}
//                     className="col-span-3"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="city" className="text-right">
//                     City
//                   </Label>
//                   <Input
//                     id="city"
//                     name="city"
//                     defaultValue={selectedMuseum.city}
//                     className="col-span-3"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="country" className="text-right">
//                     Country
//                   </Label>
//                   <Input
//                     id="country"
//                     name="country"
//                     defaultValue={selectedMuseum.country}
//                     className="col-span-3"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="website" className="text-right">
//                     Website
//                   </Label>
//                   <Input
//                     id="website"
//                     name="website"
//                     defaultValue={selectedMuseum.website || ""}
//                     placeholder="https://example.com"
//                     className="col-span-3"
//                   />
//                 </div>

//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="logoUrl" className="text-right">
//                     Logo URL
//                   </Label>
//                   <Input
//                     id="logoUrl"
//                     name="logoUrl"
//                     defaultValue={selectedMuseum.logoUrl || ""}
//                     placeholder="https://example.com/logo.png"
//                     className="col-span-3"
//                   />
//                 </div>

//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="featuredImageUrl" className="text-right">
//                     Featured Image
//                   </Label>
//                   <Input
//                     id="featuredImageUrl"
//                     name="featuredImageUrl"
//                     defaultValue={selectedMuseum.featuredImageUrl || ""}
//                     placeholder="https://example.com/image.jpg"
//                     className="col-span-3"
//                   />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setIsEditDialogOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   disabled={updateMuseumMutation.isPending}
//                 >
//                   {updateMuseumMutation.isPending ? "Saving..." : "Save Changes"}
//                 </Button>
//               </DialogFooter>
//             </form>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Museum } from "@/types";
import { Check, X, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MuseumManagement() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Redirect if not authenticated or not super admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "super_admin")) {
      router.push("/admin/login");
    }
  }, [authLoading, isAuthenticated, router, user]);

  // Fetch museums with different approval statuses
  const { data: pendingMuseums, isLoading: pendingLoading } = useQuery<Museum[]>({
    queryKey: ['/superadmin/museums', { approved: false }],
    enabled: isAuthenticated && user?.role === "super_admin",
  });

  const { data: approvedMuseums, isLoading: approvedLoading } = useQuery<Museum[]>({
    queryKey: ['/superadmin/museums', { approved: true }],
    enabled: isAuthenticated && user?.role === "super_admin",
  });

  // Mutations for museum actions
  const approveMuseumMutation = useMutation({
    mutationFn: async (museumId: string) => {
      const response = await apiRequest("PATCH", `/superadmin/museums/${museumId}/approve`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/superadmin/museums'] });

      toast({
        title: "Museum approved",
        description: "The museum has been approved and is now active",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Approval failed",
        description: error.message || "There was an error approving the museum",
        variant: "destructive",
      });
    }
  });

  const rejectMuseumMutation = useMutation({
    mutationFn: async (museumId: string) => {
      const response = await apiRequest("PATCH", `/superadmin/museums/${museumId}/reject`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/superadmin/museums'] });

      toast({
        title: "Museum rejected",
        description: "The museum has been rejected",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Rejection failed",
        description: error.message || "There was an error rejecting the museum",
        variant: "destructive",
      });
    }
  });

  const updateMuseumStatusMutation = useMutation({
    mutationFn: async ({ museumId, isActive }: { museumId: string; isActive: boolean }) => {
      const response = await apiRequest("PATCH", `/superadmin/museums/${museumId}`, {
        isActive 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/superadmin/museums'] });

      toast({
        title: "Status updated",
        description: "Museum status has been updated successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating the museum status",
        variant: "destructive",
      });
    }
  });

  const updateMuseumMutation = useMutation({
    mutationFn: async (data: Partial<Museum> & { id: string }) => {
      const response = await apiRequest("PATCH", `/superadmin/museums/${data.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/superadmin/museums'] });
      setIsEditDialogOpen(false);

      toast({
        title: "Museum updated",
        description: "Museum details have been updated successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating the museum",
        variant: "destructive",
      });
    }
  });

  // Handle museum actions
  const handleApproveMuseum = (museum: Museum) => {
    approveMuseumMutation.mutate(museum.id);
  };

  const handleRejectMuseum = (museum: Museum) => {
    rejectMuseumMutation.mutate(museum.id);
  };

  const handleStatusToggle = (museum: Museum, isActive: boolean) => {
    updateMuseumStatusMutation.mutate({ museumId: museum.id, isActive });
  };

  const handleEditMuseum = (museum: Museum) => {
    setSelectedMuseum(museum);
    setIsEditDialogOpen(true);
  };

  const handleUpdateMuseum = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMuseum) return;

    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    const data = {
      id: selectedMuseum.id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      city: formData.get("city") as string,
      country: formData.get("country") as string,
      website: formData.get("website") as string || null,
      logoUrl: formData.get("logoUrl") as string || null,
      featuredImageUrl: formData.get("featuredImageUrl") as string || null,
    };

    updateMuseumMutation.mutate(data);
  };

  // Filter museums by search query
  const filteredPendingMuseums = (pendingMuseums ?? []).filter(
    (museum: Museum) => museum.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApprovedMuseums = (approvedMuseums ?? []).filter(
    (museum: Museum) => museum.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (authLoading || pendingLoading || approvedLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-64" />
        </div>

        <Skeleton className="h-12 w-full" />

        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Museum Management</h1>
          <p className="text-muted-foreground">Manage museum accounts and content</p>
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search museums..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Museum
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">
            Pending Approval {(pendingMuseums ?? []).length > 0 && `(${(pendingMuseums ?? []).length})`}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved Museums
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">
              {filteredPendingMuseums?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPendingMuseums.map((museum: Museum) => (
                      <TableRow key={museum.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {museum.logoUrl ? (
                              <img
                                src={museum.logoUrl}
                                alt={museum.name} 
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {museum.name.charAt(0)}
                              </div>
                            )}
                            {museum.name}
                          </div>
                        </TableCell>
                        <TableCell>{museum.city}, {museum.country}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {museum.museumType || "General"}
                          </Badge>
                        </TableCell>
                        <TableCell>{museum.website || "—"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditMuseum(museum)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleApproveMuseum(museum)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRejectMuseum(museum)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No pending museums found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardContent className="p-0">
              {filteredApprovedMuseums?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApprovedMuseums.map((museum: Museum) => (
                      <TableRow key={museum.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {museum.logoUrl ? (
                              <img
                                src={museum.logoUrl}
                                alt={museum.name} 
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {museum.name.charAt(0)}
                              </div>
                            )}
                            {museum.name}
                          </div>
                        </TableCell>
                        <TableCell>{museum.city}, {museum.country}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {museum.museumType || "General"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={museum.isActive === true}
                              onCheckedChange={(checked) => handleStatusToggle(museum, checked)}
                            />
                            <span className={museum.isActive ? "text-green-600" : "text-muted-foreground"}>
                              {museum.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Badge className="bg-blue-500 hover:bg-blue-600">Stories</Badge>
                            <Badge className="bg-purple-500 hover:bg-purple-600">Gallery</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditMuseum(museum)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/museums/${museum.id}`)}
                            >
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No approved museums found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Museum Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Museum Details</DialogTitle>
            <DialogDescription>
              Update the museum information
            </DialogDescription>
          </DialogHeader>

          {selectedMuseum && (
            <form onSubmit={handleUpdateMuseum}>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedMuseum.name}
                    className="col-span-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={selectedMuseum.description}
                    rows={3}
                    className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={selectedMuseum.location}
                    className="col-span-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="city" className="text-right">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    defaultValue={selectedMuseum.city}
                    className="col-span-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="country" className="text-right">
                    Country
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    defaultValue={selectedMuseum.country}
                    className="col-span-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="website" className="text-right">
                    Website
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    defaultValue={selectedMuseum.website || ""}
                    placeholder="https://example.com"
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="logoUrl" className="text-right">
                    Logo URL
                  </Label>
                  <Input
                    id="logoUrl"
                    name="logoUrl"
                    defaultValue={selectedMuseum.logoUrl || ""}
                    placeholder="https://example.com/logo.png"
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="featuredImageUrl" className="text-right">
                    Featured Image
                  </Label>
                  <Input
                    id="featuredImageUrl"
                    name="featuredImageUrl"
                    defaultValue={selectedMuseum.featuredImageUrl || ""}
                    placeholder="https://example.com/image.jpg"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={updateMuseumMutation.isPending}
                >
                  {updateMuseumMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
