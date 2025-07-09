// "use client";

// import { useEffect, useState } from "react";

// import { useAuth } from "@/contexts/AuthContext";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { apiRequest } from "@/lib/queryClient";
// import { useToast } from "@/hooks/use-toast";
// import { Museum, User } from "@/types";
// import { Search, UserPlus, Edit, Key } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// export default function UserManagement() {
//   const router = useRouter()
//   const { user, isAuthenticated, isLoading: authLoading } = useAuth();

//   const queryClient = useQueryClient();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);

//   // Redirect if not authenticated or not super admin
//   useEffect(() => {
//     if (!authLoading && (!isAuthenticated || user?.role !== "super_admin")) {
//       router.push("/admin/login");
//     }
//   }, [authLoading, isAuthenticated, router, user]);

//   // Fetch users data
//   const { data: usersData, isLoading: usersLoading } = useQuery<User[]>({
//     queryKey: ['/superadmin/users'],
//     enabled: isAuthenticated && user?.role === "super_admin",
//   });

//   // Fetch museums for dropdown
//   const { data: museumsData, isLoading: museumsLoading } = useQuery<Museum[]>({
//     queryKey: ['/superadmin/museums', { approved: true }],
//     enabled: isAuthenticated && user?.role === "super_admin",
//   });

//   // User mutations
//   const createUserMutation = useMutation({
//     mutationFn: async (userData: any) => {
//       const response = await apiRequest("POST", "/superadmin/users", userData);
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['/superadmin/users'] });
//       setIsCreateDialogOpen(false);

//       router.refresh();

//       toast.success("The user has been created successfully");
//     },
//     onError: (error: any) => {
//       toast.error(error.message || "There was an error creating the user");
//     }
//   });

//   const updateUserMutation = useMutation({
//     mutationFn: async (userData: any) => {
//       const response = await apiRequest("PATCH", `/superadmin/users/${userData.id}`, userData);
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['/superadmin/users'] });
//       setIsEditDialogOpen(false);

//       toast.success("The user has been updated successfully");
//     },
//     onError: (error: any) => {
//       toast.error(error.message || "There was an error updating the user");
//     }
//   });

//   const resetPasswordMutation = useMutation({
//     mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
//       const response = await apiRequest("POST", `/superadmin/users/${userId}/reset-password`, {
//         password: newPassword
//       });
//       return response.json();
//     },
//     onSuccess: () => {
//       setIsResetPasswordDialogOpen(false);

//       toast("The user's password has been reset successfully");
//     },
//     onError: (error: any) => {
//       toast.error(error.message || "There was an error resetting the password");
//     }
//   });

//   const toggleUserStatusMutation = useMutation({
//     mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
//       const response = await apiRequest("PATCH", `/superadmin/users/${userId}`, {
//         isActive
//       });
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['/superadmin/users'] });

//       toast("The user's status has been updated successfully");
//     },
//     onError: (error: any) => {
//       toast(error.message || "There was an error updating the user status");
//     }
//   });

//   // Form handlers
//   const handleCreateUser = (e: React.FormEvent) => {
//     e.preventDefault();

//     const formElement = e.target as HTMLFormElement;
//     const formData = new FormData(formElement);

//     const roleValue = formData.get("role") as string;
//     let museumid: string | null = null;

//     if (roleValue === "museum_admin") {
//       const museumIdValue = formData.get("museumId") as string;
//       museumid = museumIdValue ? museumIdValue : null;
//     }

//     const userData = {
//       username: formData.get("username") as string,
//       password: formData.get("password") as string,
//       email: formData.get("email") as string,
//       fullName: formData.get("fullName") as string,
//       role: roleValue,
//       museumid,
//       isActive: true
//     };

//     createUserMutation.mutate(userData);
//   };

//   const handleUpdateUser = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!selectedUser) return;

//     const formElement = e.target as HTMLFormElement;
//     const formData = new FormData(formElement);

//     const roleValue = formData.get("role") as string;
//     let museumid: string | null = null;

//     if (roleValue === "museum_admin") {
//       const museumIdValue = formData.get("museumId") as string;
//       museumid = museumIdValue ?? null;
//     }

//     const userData = {
//       id: selectedUser.id,
//       email: formData.get("email") as string,
//       fullName: formData.get("fullName") as string,
//       role: roleValue,
//       museumid
//     };

//     updateUserMutation.mutate(userData);
//   };

//   const handleResetPassword = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!selectedUser) return;

//     const formElement = e.target as HTMLFormElement;
//     const formData = new FormData(formElement);

//     const newPassword = formData.get("newPassword") as string;

//     resetPasswordMutation.mutate({
//       userId: selectedUser.id,
//       newPassword
//     });
//   };

//   const handleToggleStatus = (userData: User, isActive: boolean) => {
//     toggleUserStatusMutation.mutate({ userId: userData.id, isActive });
//   };

//   // Filter users by search query
//   const filteredUsers = usersData?.filter(
//     (user: User) => {
//       const searchLower = searchQuery.toLowerCase();
//       return user.username.toLowerCase().includes(searchLower) ||
//         user.fullName.toLowerCase().includes(searchLower) ||
//         user.email.toLowerCase().includes(searchLower);
//     }
//   );

//   // Loading state
//   if (authLoading || usersLoading) {
//     return (
//       <div className="p-6 space-y-6">
//         <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
//         <div className="h-10 bg-gray-200 rounded animate-pulse mb-6"></div>
//         <div className="h-[500px] bg-gray-200 rounded animate-pulse"></div>
//       </div>
//     );
//   }

//   // Get museum name by id
//   const getMuseumName = (museumId: string | null) => {
//     if (!museumId) return "—";
//     const museum = museumsData?.find((m: any) => m.id === museumId);
//     return museum ? museum.name : `Museum #${museumId}`;
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-primary">User Management</h1>
//           <p className="text-muted-foreground">Manage platform administrators and museum users</p>
//         </div>

//         <div className="w-full md:w-auto flex items-center gap-2">
//           <div className="relative w-full md:w-64">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search users..."
//               className="pl-8"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <Button onClick={() => setIsCreateDialogOpen(true)}>
//             <UserPlus className="h-4 w-4 mr-2" />
//             New User
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Platform Users</CardTitle>
//         </CardHeader>
//         <CardContent className="p-0">
//           {(filteredUsers || [])?.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Username</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Role</TableHead>
//                   <TableHead>Museum</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {(filteredUsers || []).map((userData: User) => (
//                   <TableRow key={userData.id}>
//                     <TableCell className="font-medium">{userData.fullName}</TableCell>
//                     <TableCell>{userData.username}</TableCell>
//                     <TableCell>{userData.email}</TableCell>
//                     <TableCell>
//                       <Badge className={
//                         userData.role === "super_admin"
//                           ? "bg-red-600 hover:bg-red-700"
//                           : "bg-blue-600 hover:bg-blue-700"
//                       }>
//                         {userData.role === "super_admin" ? "Super Admin" : "Museum Admin"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       {userData.role === "museum_admin"
//                         ? getMuseumName(userData.museumId)
//                         : "—"
//                       }
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <Switch
//                           checked={userData.isActive}
//                           onCheckedChange={(checked) => handleToggleStatus(userData, checked)}
//                           disabled={userData.id === user?.id} // Prevent disabling your own account
//                         />
//                         <span className={userData.isActive ? "text-green-600" : "text-muted-foreground"}>
//                           {userData.isActive ? "Active" : "Inactive"}
//                         </span>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex items-center justify-end gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => {
//                             setSelectedUser(userData);
//                             setIsEditDialogOpen(true);
//                           }}
//                         >
//                           <Edit className="h-4 w-4 mr-1" />
//                           Edit
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => {
//                             setSelectedUser(userData);
//                             setIsResetPasswordDialogOpen(true);
//                           }}
//                         >
//                           <Key className="h-4 w-4 mr-1" />
//                           Reset
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <div className="py-12 text-center">
//               <p className="text-muted-foreground">No users found</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Create User Dialog */}
//       <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Create New User</DialogTitle>
//             <DialogDescription>
//               Add a new administrator to the platform
//             </DialogDescription>
//           </DialogHeader>

//           <form onSubmit={handleCreateUser}>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="fullName" className="text-right">
//                   Full Name
//                 </Label>
//                 <Input
//                   id="fullName"
//                   name="fullName"
//                   className="col-span-3"
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="email" className="text-right">
//                   Email
//                 </Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   className="col-span-3"
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="username" className="text-right">
//                   Username
//                 </Label>
//                 <Input
//                   id="username"
//                   name="username"
//                   className="col-span-3"
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="password" className="text-right">
//                   Password
//                 </Label>
//                 <Input
//                   id="password"
//                   name="password"
//                   type="password"
//                   className="col-span-3"
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="role" className="text-right">
//                   Role
//                 </Label>
//                 <Select name="role" defaultValue="museum_admin" required>
//                   <SelectTrigger className="col-span-3">
//                     <SelectValue placeholder="Select role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="museum_admin">Museum Administrator</SelectItem>
//                     <SelectItem value="super_admin">Super Administrator</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="museumId" className="text-right">
//                   Museum
//                 </Label>
//                 <Select name="museumId">
//                   <SelectTrigger className="col-span-3">
//                     <SelectValue placeholder="Select museum" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {museumsData?.map((museum: any) => (
//                       <SelectItem key={museum.id} value={museum.id.toString()}>
//                         {museum.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <DialogFooter>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setIsCreateDialogOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={createUserMutation.isPending}
//               >
//                 {createUserMutation.isPending ? "Creating..." : "Create User"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Edit User Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Edit User</DialogTitle>
//             <DialogDescription>
//               Update user information
//             </DialogDescription>
//           </DialogHeader>

//           {selectedUser && (
//             <form onSubmit={handleUpdateUser}>
//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="edit-fullName" className="text-right">
//                     Full Name
//                   </Label>
//                   <Input
//                     id="edit-fullName"
//                     name="fullName"
//                     defaultValue={selectedUser.fullName}
//                     className="col-span-3"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="edit-email" className="text-right">
//                     Email
//                   </Label>
//                   <Input
//                     id="edit-email"
//                     name="email"
//                     type="email"
//                     defaultValue={selectedUser.email}
//                     className="col-span-3"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="edit-username" className="text-right">
//                     Username
//                   </Label>
//                   <div className="col-span-3 text-muted-foreground">
//                     {selectedUser.username}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="edit-role" className="text-right">
//                     Role
//                   </Label>
//                   <Select name="role" defaultValue={selectedUser.role}>
//                     <SelectTrigger className="col-span-3">
//                       <SelectValue placeholder="Select role" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="museum_admin">Museum Administrator</SelectItem>
//                       <SelectItem value="super_admin">Super Administrator</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="edit-museumId" className="text-right">
//                     Museum
//                   </Label>
//                   <Select
//                     name="museumId"
//                     defaultValue={selectedUser.museumId?.toString()}
//                   >
//                     <SelectTrigger className="col-span-3">
//                       <SelectValue placeholder="Select museum" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {museumsData?.map((museum: any) => (
//                         <SelectItem key={museum.id} value={museum.id.toString()}>
//                           {museum.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
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
//                   disabled={updateUserMutation.isPending}
//                 >
//                   {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
//                 </Button>
//               </DialogFooter>
//             </form>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Reset Password Dialog */}
//       <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Reset Password</DialogTitle>
//             <DialogDescription>
//               {selectedUser && `Set a new password for ${selectedUser.fullName}`}
//             </DialogDescription>
//           </DialogHeader>

//           {selectedUser && (
//             <form onSubmit={handleResetPassword}>
//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="newPassword" className="text-right">
//                     New Password
//                   </Label>
//                   <Input
//                     id="newPassword"
//                     name="newPassword"
//                     type="password"
//                     className="col-span-3"
//                     required
//                   />
//                 </div>
//               </div>

//               <DialogFooter>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setIsResetPasswordDialogOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   disabled={resetPasswordMutation.isPending}
//                 >
//                   {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User } from "../../../../badagry_backend/types";
import { Search, UserPlus, Edit, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UserManagement() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not authenticated or not super admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "super_admin")) {
      router.push("/admin/login");
    }
  }, [authLoading, isAuthenticated, router, user]);

  // Fetch users data
  const { data: usersData, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/superadmin/users'],
    enabled: isAuthenticated && user?.role === "super_admin",
  });

  // Fetch museums for dropdown
  const { data: museumsData, isLoading: museumsLoading } = useQuery({
    queryKey: ['/superadmin/museums', { approved: true }],
    enabled: isAuthenticated && user?.role === "super_admin",
  });

  // User mutations
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest("POST", "/superadmin/users", userData);

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        throw new Error(errorData.error || "Failed to create user");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/superadmin/users'] });
      setIsCreateDialogOpen(false);
      toast.success("User created successfully!"); // Positive feedback
    },
    onError: (error: Error) => {
      toast.error(error.message); // Show server's custom error message
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest("PATCH", `/superadmin/users/${userData.id}`, userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/superadmin/users'] });
      setIsEditDialogOpen(false);

      toast("The user has been updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "There was an error updating the user");
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
      const response = await apiRequest("POST", `/superadmin/users/${userId}/reset-password`, {
        password: newPassword
      });
      return response.json();
    },
    onSuccess: () => {
      setIsResetPasswordDialogOpen(false);

      toast("The user's password has been reset successfully");
    },
    onError: (error: any) => {
      toast(error.message || "There was an error resetting the password");
    }
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const response = await apiRequest("PATCH", `/superadmin/users/${userId}`, {
        isActive
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/superadmin/users'] });

      toast("The user's status has been updated successfully");
    },
    onError: (error: any) => {

      toast(error.message || "There was an error updating the user status");
    }
  });

  // Form handlers
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();

    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    const roleValue = formData.get("role") as string;
    let museumId: string | null = null;

    if (roleValue === "museum_admin") {
      const museumIdValue = formData.get("museumId") as string;
      museumId = museumIdValue ?? null;
    }

    const userData = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      email: formData.get("email") as string,
      fullName: formData.get("fullName") as string,
      role: roleValue,
      museumId,
      isActive: true
    };

    createUserMutation.mutate(userData);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    const roleValue = formData.get("role") as string;
    let museumId: string | null = null;

    if (roleValue === "museum_admin") {
      const museumIdValue = formData.get("museumId") as string;
      museumId = museumIdValue ?? null;
    }

    const userData = {
      id: selectedUser.id,
      email: formData.get("email") as string,
      fullName: formData.get("fullName") as string,
      role: roleValue,
      museumId
    };

    updateUserMutation.mutate(userData);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    const newPassword = formData.get("newPassword") as string;

    resetPasswordMutation.mutate({
      userId: selectedUser.id,
      newPassword
    });
  };

  const handleToggleStatus = (userData: User, isActive: boolean) => {
    toggleUserStatusMutation.mutate({ userId: userData.id, isActive });
  };

  // Filter users by search query
  const filteredUsers = usersData?.filter(
    (user: User) => {
      const searchLower = searchQuery.toLowerCase();
      return user.username.toLowerCase().includes(searchLower) ||
        user.fullName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);
    }
  );

  // Loading state
  if (authLoading || usersLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse mb-4"></div>
        <div className="h-10 bg-muted rounded animate-pulse mb-6"></div>
        <div className="h-[500px] bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  // Get museum name by id
  const getMuseumName = (museumId: string | null) => {
    if (!museumId) return "—";
    const museumsArray = Array.isArray(museumsData) ? museumsData : [];
    const museum = museumsArray.find((m: any) => m.id === museumId);
    return museum ? museum.name : `Museum #${museumId}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">User Management</h1>
          <p className="text-muted-foreground">Manage platform administrators and museum users</p>
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            New User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {(filteredUsers ?? []).length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Museum</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filteredUsers ?? []).map((userData: User) => (
                  <TableRow key={userData.id}>
                    <TableCell className="font-medium">{userData.fullName}</TableCell>
                    <TableCell>{userData.username}</TableCell>
                    <TableCell>{userData.email}</TableCell>
                    <TableCell>
                      <Badge className={
                        userData.role === "super_admin"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }>
                        {userData.role === "super_admin" ? "Super Admin" : "Museum Admin"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {userData.role === "museum_admin"
                        ? getMuseumName(userData.museumId)
                        : "—"
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={userData.isActive}
                          onCheckedChange={(checked) => handleToggleStatus(userData, checked)}
                          disabled={userData.id === user?.id} // Prevent disabling your own account
                        />
                        <span className={userData.isActive ? "text-green-600" : "text-muted-foreground"}>
                          {userData.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(userData);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(userData);
                            setIsResetPasswordDialogOpen(true);
                          }}
                        >
                          <Key className="h-4 w-4 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new administrator to the platform
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select name="role" defaultValue="museum_admin" required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="museum_admin">Museum Administrator</SelectItem>
                    <SelectItem value="super_admin">Super Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="museumId" className="text-right">
                  Museum
                </Label>
                <Select name="museumId">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select museum" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Array.isArray(museumsData) ? museumsData : []).map((museum: any) => (
                      <SelectItem key={museum.id} value={museum.id.toString()}>
                        {museum.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleUpdateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-fullName" className="text-right">
                    Full Name
                  </Label>
                  <Input
                    id="edit-fullName"
                    name="fullName"
                    defaultValue={selectedUser.fullName}
                    className="col-span-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={selectedUser.email}
                    className="col-span-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-username" className="text-right">
                    Username
                  </Label>
                  <div className="col-span-3 text-muted-foreground">
                    {selectedUser.username}
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">
                    Role
                  </Label>
                  <Select name="role" defaultValue={selectedUser.role}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="museum_admin">Museum Administrator</SelectItem>
                      <SelectItem value="super_admin">Super Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-museumId" className="text-right">
                    Museum
                  </Label>
                  <Select
                    name="museumId"
                    defaultValue={selectedUser.museumId?.toString()}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select museum" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(museumsData) ? museumsData : []).map((museum: any) => (
                        <SelectItem key={museum.id} value={museum.id.toString()}>
                          {museum.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  disabled={updateUserMutation.isPending}
                >
                  {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              {selectedUser && `Set a new password for ${selectedUser.fullName}`}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleResetPassword}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newPassword" className="text-right">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="col-span-3"
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsResetPasswordDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
