"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Settings as SettingsIcon,
  Globe,
  Mail,
  Shield,
  Database,
  Palette,
  Bell,
  Users,
  FileText,
  Zap,
  Key,
  AlertTriangle,
  Save,
  RotateCcw
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PlatformSettings } from "../../../../badagry_backend/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export default function Settings() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<PlatformSettings>({
    general: {
      siteName: "Museum Digital Platform",
      siteDescription: "A comprehensive platform for museum digital experiences",
      contactEmail: "contact@museum-platform.com",
      supportEmail: "support@museum-platform.com",
      defaultLanguage: "en",
      timezone: "UTC",
      allowRegistration: true,
      requireEmailVerification: true,
      maintenanceMode: false,
    },
    security: {
      passwordMinLength: 8,
      requireStrongPasswords: true,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      enableTwoFactor: false,
      allowPasswordReset: true,
    },
    email: {
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      fromEmail: "noreply@museum-platform.com",
      fromName: "Museum Platform",
      enableEmailNotifications: true,
    },
    content: {
      maxFileSize: 10,
      allowedFileTypes: ["jpg", "jpeg", "png", "gif", "pdf", "mp4", "mp3"],
      autoModeration: true,
      requireApproval: true,
      enableComments: true,
      enableRatings: true,
    },
    appearance: {
      primaryColor: "#2563eb",
      secondaryColor: "#64748b",
      logo: "",
      favicon: "",
      customCSS: "",
      darkModeEnabled: true,
    },
    notifications: {
      newUserSignup: true,
      newMuseumApplication: true,
      contentFlagged: true,
      systemAlerts: true,
      weeklyReports: true,
      emailDigest: false,
    }
  });

  // Redirect if not authenticated or not super admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "super_admin")) {
      router.push("/sadmin/auth");
    }
  }, [authLoading, isAuthenticated, router, user]);

  // Fetch current settings
  const { data: currentSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/settings'],
    enabled: isAuthenticated && user?.role === "super_admin",
  });

  // Update settings when data is fetched
  useEffect(() => {
    if (currentSettings && typeof currentSettings === 'object') {
      setSettings(currentSettings as PlatformSettings);
    }
  }, [currentSettings]);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: (data: Partial<PlatformSettings>) => apiRequest('/settings', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/settings'] });
      toast("Platform settings have been updated successfully");
    },
    onError: () => {
      toast.error("Failed to save settings");
    }
  });

  // Test email configuration
  const testEmailMutation = useMutation({
    mutationFn: () => apiRequest('/settings/test-email', 'POST'),
    onSuccess: () => {
      toast("Test email sent successfully");
    },
    onError: () => {
      toast.error("Failed to send test email. Check your email configuration.");
    }
  });

  const handleSaveSettings = (section?: string) => {
    const dataToSave = section ? { [section]: settings[section as keyof PlatformSettings] } : settings;
    saveSettingsMutation.mutate(dataToSave);
  };

  const handleResetSettings = () => {
    // Reset to default values
    setSettings({
      general: {
        siteName: "Museum Digital Platform",
        siteDescription: "A comprehensive platform for museum digital experiences",
        contactEmail: "contact@museum-platform.com",
        supportEmail: "support@museum-platform.com",
        defaultLanguage: "en",
        timezone: "UTC",
        allowRegistration: true,
        requireEmailVerification: true,
        maintenanceMode: false,
      },
      security: {
        passwordMinLength: 8,
        requireStrongPasswords: true,
        sessionTimeout: 24,
        maxLoginAttempts: 5,
        enableTwoFactor: false,
        allowPasswordReset: true,
      },
      email: {
        smtpHost: "",
        smtpPort: 587,
        smtpUser: "",
        smtpPassword: "",
        fromEmail: "noreply@museum-platform.com",
        fromName: "Museum Platform",
        enableEmailNotifications: true,
      },
      content: {
        maxFileSize: 10,
        allowedFileTypes: ["jpg", "jpeg", "png", "gif", "pdf", "mp4", "mp3"],
        autoModeration: true,
        requireApproval: true,
        enableComments: true,
        enableRatings: true,
      },
      appearance: {
        primaryColor: "#2563eb",
        secondaryColor: "#64748b",
        logo: "",
        favicon: "",
        customCSS: "",
        darkModeEnabled: true,
      },
      notifications: {
        newUserSignup: true,
        newMuseumApplication: true,
        contentFlagged: true,
        systemAlerts: true,
        weeklyReports: true,
        emailDigest: false,
      }
    });
  };

  const updateSetting = (section: keyof PlatformSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  if (authLoading || settingsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded mb-4"></div>
        <div className="h-96 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Platform Settings</h1>
          <p className="text-muted-foreground">Configure and customize your museum platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={() => handleSaveSettings()} disabled={saveSettingsMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {saveSettingsMutation.isPending ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Configure basic platform information and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select value={settings.general.defaultLanguage} onValueChange={(value) => updateSetting('general', 'defaultLanguage', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.general.timezone} onValueChange={(value) => updateSetting('general', 'timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
                  </div>
                  <Switch
                    checked={settings.general.allowRegistration}
                    onCheckedChange={(checked) => updateSetting('general', 'allowRegistration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Require users to verify email addresses</p>
                  </div>
                  <Switch
                    checked={settings.general.requireEmailVerification}
                    onCheckedChange={(checked) => updateSetting('general', 'requireEmailVerification', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Put the platform in maintenance mode</p>
                  </div>
                  <Switch
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('general')} disabled={saveSettingsMutation.isPending}>
                  Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security policies and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    min="6"
                    max="20"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="1"
                    max="168"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  min="3"
                  max="10"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Strong Passwords</Label>
                    <p className="text-sm text-muted-foreground">Enforce strong password requirements</p>
                  </div>
                  <Switch
                    checked={settings.security.requireStrongPasswords}
                    onCheckedChange={(checked) => updateSetting('security', 'requireStrongPasswords', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Allow users to enable 2FA</p>
                  </div>
                  <Switch
                    checked={settings.security.enableTwoFactor}
                    onCheckedChange={(checked) => updateSetting('security', 'enableTwoFactor', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Password Reset</Label>
                    <p className="text-sm text-muted-foreground">Allow users to reset forgotten passwords</p>
                  </div>
                  <Switch
                    checked={settings.security.allowPasswordReset}
                    onCheckedChange={(checked) => updateSetting('security', 'allowPasswordReset', checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('security')} disabled={saveSettingsMutation.isPending}>
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>Configure SMTP settings for email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Key className="h-4 w-4" />
                <AlertTitle>Secure Configuration</AlertTitle>
                <AlertDescription>
                  Email credentials are encrypted and stored securely. Test your configuration before saving.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={settings.email.smtpUser}
                    onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.email.fromName}
                    onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send system email notifications</p>
                </div>
                <Switch
                  checked={settings.email.enableEmailNotifications}
                  onCheckedChange={(checked) => updateSetting('email', 'enableEmailNotifications', checked)}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => testEmailMutation.mutate()}
                  disabled={testEmailMutation.isPending}
                >
                  {testEmailMutation.isPending ? "Testing..." : "Test Email Configuration"}
                </Button>
                <Button onClick={() => handleSaveSettings('email')} disabled={saveSettingsMutation.isPending}>
                  Save Email Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Management
              </CardTitle>
              <CardDescription>Configure content upload and moderation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.content.maxFileSize}
                  onChange={(e) => updateSetting('content', 'maxFileSize', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                <Input
                  id="allowedFileTypes"
                  value={settings.content.allowedFileTypes.join(', ')}
                  onChange={(e) => updateSetting('content', 'allowedFileTypes', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="jpg, png, pdf, mp4"
                />
                <p className="text-sm text-muted-foreground">Separate file extensions with commas</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Moderation</Label>
                    <p className="text-sm text-muted-foreground">Automatically scan content for inappropriate material</p>
                  </div>
                  <Switch
                    checked={settings.content.autoModeration}
                    onCheckedChange={(checked) => updateSetting('content', 'autoModeration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval</Label>
                    <p className="text-sm text-muted-foreground">Require admin approval for new content</p>
                  </div>
                  <Switch
                    checked={settings.content.requireApproval}
                    onCheckedChange={(checked) => updateSetting('content', 'requireApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Comments</Label>
                    <p className="text-sm text-muted-foreground">Allow users to comment on content</p>
                  </div>
                  <Switch
                    checked={settings.content.enableComments}
                    onCheckedChange={(checked) => updateSetting('content', 'enableComments', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Ratings</Label>
                    <p className="text-sm text-muted-foreground">Allow users to rate content</p>
                  </div>
                  <Switch
                    checked={settings.content.enableRatings}
                    onCheckedChange={(checked) => updateSetting('content', 'enableRatings', checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('content')} disabled={saveSettingsMutation.isPending}>
                  Save Content Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance & Branding
              </CardTitle>
              <CardDescription>Customize the visual appearance of your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                      className="w-16"
                    />
                    <Input
                      value={settings.appearance.primaryColor}
                      onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.appearance.secondaryColor}
                      onChange={(e) => updateSetting('appearance', 'secondaryColor', e.target.value)}
                      className="w-16"
                    />
                    <Input
                      value={settings.appearance.secondaryColor}
                      onChange={(e) => updateSetting('appearance', 'secondaryColor', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={settings.appearance.logo}
                    onChange={(e) => updateSetting('appearance', 'logo', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    value={settings.appearance.favicon}
                    onChange={(e) => updateSetting('appearance', 'favicon', e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCSS">Custom CSS</Label>
                <Textarea
                  id="customCSS"
                  value={settings.appearance.customCSS}
                  onChange={(e) => updateSetting('appearance', 'customCSS', e.target.value)}
                  rows={6}
                  placeholder="/* Add your custom CSS here */"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Allow users to switch to dark mode</p>
                </div>
                <Switch
                  checked={settings.appearance.darkModeEnabled}
                  onCheckedChange={(checked) => updateSetting('appearance', 'darkModeEnabled', checked)}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('appearance')} disabled={saveSettingsMutation.isPending}>
                  Save Appearance Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New User Signup</Label>
                    <p className="text-sm text-muted-foreground">Notify when new users register</p>
                  </div>
                  <Switch
                    checked={settings.notifications.newUserSignup}
                    onCheckedChange={(checked) => updateSetting('notifications', 'newUserSignup', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Museum Application</Label>
                    <p className="text-sm text-muted-foreground">Notify when museums apply to join</p>
                  </div>
                  <Switch
                    checked={settings.notifications.newMuseumApplication}
                    onCheckedChange={(checked) => updateSetting('notifications', 'newMuseumApplication', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Content Flagged</Label>
                    <p className="text-sm text-muted-foreground">Notify when content is flagged for review</p>
                  </div>
                  <Switch
                    checked={settings.notifications.contentFlagged}
                    onCheckedChange={(checked) => updateSetting('notifications', 'contentFlagged', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify about system errors and issues</p>
                  </div>
                  <Switch
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) => updateSetting('notifications', 'systemAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Send weekly analytics reports</p>
                  </div>
                  <Switch
                    checked={settings.notifications.weeklyReports}
                    onCheckedChange={(checked) => updateSetting('notifications', 'weeklyReports', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Digest</Label>
                    <p className="text-sm text-muted-foreground">Send daily email digest to admins</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailDigest}
                    onCheckedChange={(checked) => updateSetting('notifications', 'emailDigest', checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('notifications')} disabled={saveSettingsMutation.isPending}>
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}