"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Globe, Languages, Plus, Edit3, Save, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Translation {
  id: number;
  key: string;
  language: string;
  value: string;
  context?: string;
  status: 'active' | 'draft' | 'deprecated';
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  enabled: boolean;
  completionPercentage: number;
}

export default function Localization() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [editingTranslation, setEditingTranslation] = useState<number | null>(null);
  const [newTranslation, setNewTranslation] = useState({
    key: '',
    value: '',
    context: ''
  });

  // Redirect if not authenticated or not super admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "super_admin")) {
      router.push("/sadmin/auth");
    }
  }, [authLoading, isAuthenticated, router, user]);

  // Mock data for demonstration
  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', enabled: true, completionPercentage: 100 },
    { code: 'es', name: 'Spanish', nativeName: 'Español', enabled: true, completionPercentage: 85 },
    { code: 'fr', name: 'French', nativeName: 'Français', enabled: true, completionPercentage: 72 },
    { code: 'de', name: 'German', nativeName: 'Deutsch', enabled: false, completionPercentage: 45 },
    { code: 'zh', name: 'Chinese', nativeName: '中文', enabled: false, completionPercentage: 30 },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', enabled: false, completionPercentage: 20 },
  ];

  const translations: Translation[] = [
    { id: 1, key: 'navigation.home', language: 'en', value: 'Home', context: 'Main navigation', status: 'active' },
    { id: 2, key: 'navigation.home', language: 'es', value: 'Inicio', context: 'Main navigation', status: 'active' },
    { id: 3, key: 'navigation.home', language: 'fr', value: 'Accueil', context: 'Main navigation', status: 'active' },
    { id: 4, key: 'navigation.museums', language: 'en', value: 'Museums', context: 'Main navigation', status: 'active' },
    { id: 5, key: 'navigation.museums', language: 'es', value: 'Museos', context: 'Main navigation', status: 'active' },
    { id: 6, key: 'navigation.museums', language: 'fr', value: 'Musées', context: 'Main navigation', status: 'active' },
    { id: 7, key: 'button.submit', language: 'en', value: 'Submit', context: 'Form buttons', status: 'active' },
    { id: 8, key: 'button.submit', language: 'es', value: 'Enviar', context: 'Form buttons', status: 'active' },
    { id: 9, key: 'button.submit', language: 'fr', value: 'Soumettre', context: 'Form buttons', status: 'active' },
    { id: 10, key: 'message.welcome', language: 'en', value: 'Welcome to our museum platform', context: 'Welcome messages', status: 'active' },
    { id: 11, key: 'message.welcome', language: 'es', value: 'Bienvenido a nuestra plataforma de museos', context: 'Welcome messages', status: 'active' },
    { id: 12, key: 'message.welcome', language: 'fr', value: 'Bienvenue sur notre plateforme muséale', context: 'Welcome messages', status: 'active' },
  ];

  const filteredTranslations = translations.filter(t => t.language === selectedLanguage);

  const handleAddTranslation = () => {
    if (!newTranslation.key || !newTranslation.value) {
      toast({
        title: "Error",
        description: "Key and value are required",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would call the API
    toast({
      title: "Translation Added",
      description: `Added translation for key: ${newTranslation.key}`,
    });

    setNewTranslation({ key: '', value: '', context: '' });
  };

  const handleUpdateTranslation = (id: number, value: string) => {
    // In a real app, this would call the API
    toast({
      title: "Translation Updated",
      description: "Translation has been updated successfully",
    });
    setEditingTranslation(null);
  };

  const handleToggleLanguage = (langCode: string, enabled: boolean) => {
    // In a real app, this would call the API
    toast({
      title: enabled ? "Language Enabled" : "Language Disabled",
      description: `${languages.find(l => l.code === langCode)?.name} has been ${enabled ? 'enabled' : 'disabled'}`,
    });
  };

  if (authLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded mb-4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 bg-muted animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Localization Management</h1>
        <p className="text-muted-foreground">Manage translations and language settings for the platform</p>
      </div>

      {/* Language Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {languages.map((lang) => (
          <Card key={lang.code}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{lang.name}</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{lang.nativeName}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-muted-foreground">
                  {lang.completionPercentage}% complete
                </div>
                <Badge variant={lang.enabled ? "default" : "secondary"}>
                  {lang.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${lang.completionPercentage}%` }}
                ></div>
              </div>
              <Button
                variant={lang.enabled ? "outline" : "default"}
                size="sm"
                className="w-full mt-3"
                onClick={() => handleToggleLanguage(lang.code, !lang.enabled)}
              >
                {lang.enabled ? "Disable" : "Enable"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Translation Management */}
      <Tabs defaultValue="translations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="translations">Translations</TabsTrigger>
          <TabsTrigger value="settings">Language Settings</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="translations" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="language-select">Select Language</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.filter(l => l.enabled).map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name} ({lang.nativeName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add New Translation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Translation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="new-key">Translation Key</Label>
                  <Input
                    id="new-key"
                    placeholder="e.g., navigation.home"
                    value={newTranslation.key}
                    onChange={(e) => setNewTranslation({ ...newTranslation, key: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-value">Translation Value</Label>
                  <Input
                    id="new-value"
                    placeholder="Translated text"
                    value={newTranslation.value}
                    onChange={(e) => setNewTranslation({ ...newTranslation, value: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-context">Context (Optional)</Label>
                  <Input
                    id="new-context"
                    placeholder="Usage context"
                    value={newTranslation.context}
                    onChange={(e) => setNewTranslation({ ...newTranslation, context: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleAddTranslation} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Translation
              </Button>
            </CardContent>
          </Card>

          {/* Existing Translations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Translations for {languages.find(l => l.code === selectedLanguage)?.name}
              </CardTitle>
              <CardDescription>
                {filteredTranslations.length} translations found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTranslations.map((translation) => (
                  <div key={translation.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {translation.key}
                        </code>
                        <Badge variant={translation.status === 'active' ? 'default' : 'secondary'}>
                          {translation.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTranslation(
                            editingTranslation === translation.id ? null : translation.id
                          )}
                        >
                          {editingTranslation === translation.id ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {editingTranslation === translation.id ? (
                      <div className="space-y-2">
                        <Textarea
                          defaultValue={translation.value}
                          placeholder="Translation value"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                              handleUpdateTranslation(translation.id, e.currentTarget.value);
                            }
                          }}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement;
                              handleUpdateTranslation(translation.id, textarea?.value || '');
                            }}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingTranslation(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm mb-1">{translation.value}</p>
                        {translation.context && (
                          <p className="text-xs text-muted-foreground">Context: {translation.context}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Language Settings</CardTitle>
              <CardDescription>Configure default language and regional settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Language configuration settings coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import-export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import/Export Translations</CardTitle>
              <CardDescription>Bulk import and export translation files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Languages className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Import/Export functionality coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}