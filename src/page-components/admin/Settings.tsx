"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import {
  Settings as SettingsIcon,
  Building2,
  Mail,
  Users,
  Shield,
  Eye,
  Save,
  Upload,
  Key,
  Palette,
  Globe,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  Check,
  X,
  Plus,
  Trash2,
  Edit
} from "lucide-react";
import type { EmailTemplate, Museum, User } from "../../../../badagry_backend/types";

function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for different settings sections
  const [isGeneralEditing, setIsGeneralEditing] = useState(false);
  const [isContactEditing, setIsContactEditing] = useState(false);
  const [isEmailTemplateDialogOpen, setIsEmailTemplateDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch museum data
  const { data: museum, isLoading: museumLoading } = useQuery({
    queryKey: ['/museums', user?.museumId],
    enabled: !!user?.museumId
  });

  // Fetch museum users
  const { data: museumUsers = [] } = useQuery<User[]>({
    queryKey: ['/users/museum', user?.museumId],
    enabled: !!user?.museumId
  });

  // Fetch email templates
  const { data: emailTemplates = [] } = useQuery<EmailTemplate[]>({
    queryKey: ['/email-templates', user?.museumId],
    enabled: !!user?.museumId
  });

  // Museum update mutation
  const updateMuseumMutation = useMutation({
    mutationFn: (data: Partial<Museum>) =>
      apiRequest("PATCH", `/museums/${user?.museumId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/museums'] });
      setIsGeneralEditing(false);
      setIsContactEditing(false);
      toast({
        title: "Settings updated",
        description: "Museum settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: { newPassword: string }) =>
      apiRequest("PATCH", `/users/${user?.id}/password`, data),
    onSuccess: () => {
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Email template mutation
  const saveTemplateMutation = useMutation({
    mutationFn: (data: any) => {
      if (currentTemplate?.id) {
        return apiRequest("PATCH", `/email-templates/${currentTemplate.id}`, data);
      } else {
        return apiRequest("POST", "/email-templates", { ...data, museumId: user?.museumId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/email-templates'] });
      queryClient.refetchQueries({ queryKey: ['/email-templates', user?.museumId] });
      setIsEmailTemplateDialogOpen(false);
      setCurrentTemplate(null);
      toast({
        title: "Template saved",
        description: "Email template has been saved successfully.",
      });
    }
  });

  const handleGeneralSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      website: formData.get('website') as string,
      location: formData.get('location') as string,
      city: formData.get('city') as string,
      country: formData.get('country') as string,
      museumType: formData.get('museumType') as string,
    };
    updateMuseumMutation.mutate(data);
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      contactEmail: formData.get('contactEmail') as string,
      contactPhone: formData.get('contactPhone') as string,
    } as any;
    updateMuseumMutation.mutate(data);
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    changePasswordMutation.mutate({ newPassword });
  };

  const handleEmailTemplateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('templateName') as string,
      subject: formData.get('templateSubject') as string,
      content: formData.get('templateContent') as string,
      isDefault: formData.get('isDefault') === 'on',
    };
    saveTemplateMutation.mutate(data);
  };

  if (museumLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
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
            <SettingsIcon className="h-6 w-6" />
            Museum Settings
          </h1>
          <p className="text-muted-foreground">Manage your museum profile, users, and preferences</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Check className="h-3 w-3 mr-1" />
          Account Active
        </Badge>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Museum Information
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Basic information about your museum
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsGeneralEditing(!isGeneralEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isGeneralEditing ? 'Cancel' : 'Edit'}
              </Button>
            </CardHeader>
            <CardContent>
              {isGeneralEditing ? (
                <form onSubmit={handleGeneralSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Museum Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={(museum as any)?.name || ''}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="museumType">Museum Type</Label>
                      <Select name="museumType" defaultValue={(museum as any)?.museumType || ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select museum type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="art">Art Museum</SelectItem>
                          <SelectItem value="history">History Museum</SelectItem>
                          <SelectItem value="science">Science Museum</SelectItem>
                          <SelectItem value="natural-history">Natural History</SelectItem>
                          <SelectItem value="cultural">Cultural Museum</SelectItem>
                          <SelectItem value="specialty">Specialty Museum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={(museum as any)?.description || ''}
                      rows={4}
                      placeholder="Brief description of your museum..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      defaultValue={(museum as any)?.website || ''}
                      placeholder="https://www.yourmuseum.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Address</Label>
                      <Input
                        id="location"
                        name="location"
                        defaultValue={(museum as any)?.location || ''}
                        placeholder="Street address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        defaultValue={(museum as any)?.city || ''}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        defaultValue={(museum as any)?.country || ''}
                        placeholder="Country"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={updateMuseumMutation.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {updateMuseumMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Museum Name</Label>
                      <p className="text-lg font-medium">{(museum as any)?.name || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                      <p className="text-lg">{(museum as any)?.museumType || 'Not set'}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <p className="text-sm mt-1">{(museum as any)?.description || 'No description provided'}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Website</Label>
                    <p className="text-sm mt-1">
                      {(museum as any)?.website ? (
                        <a href={(museum as any).website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {(museum as any).website}
                        </a>
                      ) : 'Not set'}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                    <p className="text-sm mt-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {[(museum as any)?.location, (museum as any)?.city, (museum as any)?.country].filter(Boolean).join(', ') || 'Not set'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Contact details and social media links
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsContactEditing(!isContactEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isContactEditing ? 'Cancel' : 'Edit'}
              </Button>
            </CardHeader>
            <CardContent>
              {isContactEditing ? (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        defaultValue={(museum as any)?.contactEmail || ''}
                        placeholder="contact@museum.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        type="tel"
                        defaultValue={(museum as any)?.contactPhone || ''}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Social Media Links</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          name="facebook"
                          defaultValue={(museum as any)?.socialMediaLinks?.facebook || ''}
                          placeholder="https://facebook.com/yourmuseum"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          name="twitter"
                          defaultValue={(museum as any)?.socialMediaLinks?.twitter || ''}
                          placeholder="https://twitter.com/yourmuseum"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          name="instagram"
                          defaultValue={(museum as any)?.socialMediaLinks?.instagram || ''}
                          placeholder="https://instagram.com/yourmuseum"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={updateMuseumMutation.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {updateMuseumMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-lg">{(museum as any)?.contactEmail || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <p className="text-lg">{(museum as any)?.contactPhone || 'Not set'}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Social Media</Label>
                    <div className="mt-2 space-y-2">
                      {(museum as any)?.socialMediaLinks?.facebook && (
                        <p className="text-sm">
                          <strong>Facebook:</strong>
                          <a href={(museum as any).socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                            {(museum as any).socialMediaLinks.facebook}
                          </a>
                        </p>
                      )}
                      {(museum as any)?.socialMediaLinks?.twitter && (
                        <p className="text-sm">
                          <strong>Twitter:</strong>
                          <a href={(museum as any).socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                            {(museum as any).socialMediaLinks.twitter}
                          </a>
                        </p>
                      )}
                      {(museum as any)?.socialMediaLinks?.instagram && (
                        <p className="text-sm">
                          <strong>Instagram:</strong>
                          <a href={(museum as any).socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                            {(museum as any).socialMediaLinks.instagram}
                          </a>
                        </p>
                      )}
                      {!(museum as any)?.socialMediaLinks?.facebook && !(museum as any)?.socialMediaLinks?.twitter && !(museum as any)?.socialMediaLinks?.instagram && (
                        <p className="text-sm text-muted-foreground">No social media links set</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Museum Users
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage users who have access to your museum's admin panel
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {museumUsers && museumUsers.length > 0 ? (
                  museumUsers.map((museumUser: User) => (
                    <div key={museumUser.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{museumUser.fullName}</p>
                          <p className="text-sm text-muted-foreground">{museumUser.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={museumUser.isActive ? "default" : "secondary"}>
                          {museumUser.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">{museumUser.role}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No additional users</p>
                    <p className="text-muted-foreground">You are the only user with access to this museum</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Templates
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage email templates for visitor communications
                </p>
              </div>
              <Dialog open={isEmailTemplateDialogOpen} onOpenChange={setIsEmailTemplateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setCurrentTemplate(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {currentTemplate ? 'Edit Email Template' : 'Create Email Template'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEmailTemplateSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="templateName">Template Name</Label>
                      <Input
                        id="templateName"
                        name="templateName"
                        defaultValue={currentTemplate?.name || ''}
                        placeholder="e.g., Visitor Inquiry Response"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="templateSubject">Email Subject</Label>
                      <Input
                        id="templateSubject"
                        name="templateSubject"
                        defaultValue={currentTemplate?.subject || ''}
                        placeholder="e.g., Thank you for your inquiry"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="templateContent">Email Content</Label>
                      <Textarea
                        id="templateContent"
                        name="templateContent"
                        defaultValue={currentTemplate?.content || ''}
                        rows={8}
                        placeholder="Enter your email template content..."
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isDefault"
                        name="isDefault"
                        defaultChecked={currentTemplate?.isDefault || false}
                      />
                      <Label htmlFor="isDefault">Set as default template</Label>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsEmailTemplateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={saveTemplateMutation.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        {saveTemplateMutation.isPending ? 'Saving...' : 'Save Template'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailTemplates && emailTemplates.length > 0 ? (
                  emailTemplates.map((template: EmailTemplate) => (
                    <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{template.name}</p>
                          {template.isDefault && (
                            <Badge variant="default" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Subject: {template.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {template.content.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCurrentTemplate(template);
                            setIsEmailTemplateDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No email templates</p>
                    <p className="text-muted-foreground">Create your first email template to improve visitor communications</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your account security and password
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Change */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Change Password</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <Button
                  onClick={handlePasswordChange}
                  disabled={!newPassword || !confirmPassword || changePasswordMutation.isPending}
                >
                  <Key className="h-4 w-4 mr-2" />
                  {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                </Button>
              </div>

              <Separator />

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                    <p className="text-lg">{user?.username}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                    <Badge variant="outline">{user?.role}</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Last Login</Label>
                    <p className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;