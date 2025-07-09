"use client";


import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Settings,
  Database,
  Server,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  Cpu,
  MemoryStick
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface MaintenanceWindow {
  id: number;
  title: string;
  description: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  affectedServices: string[];
}

interface SystemHealth {
  service: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  responseTime: number;
  lastCheck: Date;
}

interface BackupStatus {
  id: number;
  type: 'database' | 'files' | 'full';
  size: string;
  created: Date;
  status: 'completed' | 'running' | 'failed';
}

export default function Maintenance() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newMaintenanceWindow, setNewMaintenanceWindow] = useState({
    title: '',
    description: '',
    scheduledStart: '',
    scheduledEnd: '',
    affectedServices: [] as string[]
  });

  // Redirect if not authenticated or not super admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "super_admin")) {
      router.push("/sadmin/auth");
    }
  }, [authLoading, isAuthenticated, router, user]);

  // Mock data for demonstration
  const systemHealth: SystemHealth[] = [
    { service: 'Web Server', status: 'healthy', uptime: '15 days, 3 hours', responseTime: 145, lastCheck: new Date() },
    { service: 'Database', status: 'healthy', uptime: '15 days, 3 hours', responseTime: 23, lastCheck: new Date() },
    { service: 'File Storage', status: 'warning', uptime: '2 days, 1 hour', responseTime: 287, lastCheck: new Date() },
    { service: 'Email Service', status: 'healthy', uptime: '15 days, 3 hours', responseTime: 412, lastCheck: new Date() },
    { service: 'CDN', status: 'healthy', uptime: '30 days, 12 hours', responseTime: 89, lastCheck: new Date() },
  ];

  const maintenanceWindows: MaintenanceWindow[] = [
    {
      id: 1,
      title: 'Database Optimization',
      description: 'Scheduled database maintenance and optimization',
      scheduledStart: new Date('2024-01-20T02:00:00Z'),
      scheduledEnd: new Date('2024-01-20T04:00:00Z'),
      status: 'completed',
      affectedServices: ['Database', 'Web Server']
    },
    {
      id: 2,
      title: 'Security Updates',
      description: 'Critical security patches and system updates',
      scheduledStart: new Date('2024-01-25T01:00:00Z'),
      scheduledEnd: new Date('2024-01-25T03:00:00Z'),
      status: 'scheduled',
      affectedServices: ['Web Server', 'File Storage']
    }
  ];

  const backupHistory: BackupStatus[] = [
    { id: 1, type: 'full', size: '2.3 GB', created: new Date('2024-01-18T02:00:00Z'), status: 'completed' },
    { id: 2, type: 'database', size: '890 MB', created: new Date('2024-01-17T02:00:00Z'), status: 'completed' },
    { id: 3, type: 'files', size: '1.4 GB', created: new Date('2024-01-16T02:00:00Z'), status: 'completed' },
    { id: 4, type: 'database', size: '885 MB', created: new Date('2024-01-15T02:00:00Z'), status: 'completed' },
  ];

  const systemMetrics = {
    cpuUsage: 23,
    memoryUsage: 67,
    diskUsage: 45,
    networkTraffic: '1.2 GB/day'
  };

  const handleMaintenanceModeToggle = (enabled: boolean) => {
    setMaintenanceMode(enabled);
    toast({
      title: enabled ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled",
      description: enabled ? "The platform is now in maintenance mode" : "The platform is now accessible to users",
    });
  };

  const handleScheduleMaintenance = () => {
    if (!newMaintenanceWindow.title || !newMaintenanceWindow.scheduledStart) {
      toast({
        title: "Error",
        description: "Title and start time are required",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Maintenance Scheduled",
      description: `Maintenance window "${newMaintenanceWindow.title}" has been scheduled`,
    });

    setNewMaintenanceWindow({
      title: '',
      description: '',
      scheduledStart: '',
      scheduledEnd: '',
      affectedServices: []
    });
  };

  const handleBackupNow = (type: 'database' | 'files' | 'full') => {
    toast({
      title: "Backup Started",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} backup has been initiated`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      case 'completed': return 'text-green-600';
      case 'scheduled': return 'text-blue-600';
      case 'active': return 'text-orange-600';
      case 'cancelled': return 'text-muted-foreground';
      case 'running': return 'text-blue-600';
      case 'failed': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'completed': return 'default';
      case 'warning': return 'secondary';
      case 'critical':
      case 'failed': return 'destructive';
      default: return 'outline';
    }
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
        <h1 className="text-2xl font-bold text-primary">System Maintenance</h1>
        <p className="text-muted-foreground">Monitor system health, schedule maintenance, and manage backups</p>
      </div>

      {/* Maintenance Mode Alert */}
      {maintenanceMode && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Maintenance Mode Active</AlertTitle>
          <AlertDescription>
            The platform is currently in maintenance mode. Users will see a maintenance page.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Mode</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                checked={maintenanceMode}
                onCheckedChange={handleMaintenanceModeToggle}
              />
              <span className="text-sm">{maintenanceMode ? 'Enabled' : 'Disabled'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">Overall uptime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-muted-foreground">Full system backup</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Maintenance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 days</div>
            <p className="text-xs text-muted-foreground">Security updates</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="health" className="space-y-4">
        <TabsList>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Windows</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="metrics">System Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                Service Status
              </CardTitle>
              <CardDescription>Real-time status of all system services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${service.status === 'healthy' ? 'bg-green-500' :
                        service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                      <div>
                        <div className="font-medium">{service.service}</div>
                        <div className="text-sm text-muted-foreground">
                          Uptime: {service.uptime}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusBadgeVariant(service.status)}>
                        {service.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        {service.responseTime}ms
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Maintenance Window</CardTitle>
              <CardDescription>Plan and schedule system maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maintenance-title">Title</Label>
                  <Input
                    id="maintenance-title"
                    placeholder="Maintenance title"
                    value={newMaintenanceWindow.title}
                    onChange={(e) => setNewMaintenanceWindow({ ...newMaintenanceWindow, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="maintenance-start">Start Time</Label>
                  <Input
                    id="maintenance-start"
                    type="datetime-local"
                    value={newMaintenanceWindow.scheduledStart}
                    onChange={(e) => setNewMaintenanceWindow({ ...newMaintenanceWindow, scheduledStart: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="maintenance-description">Description</Label>
                  <Textarea
                    id="maintenance-description"
                    placeholder="Describe the maintenance work"
                    value={newMaintenanceWindow.description}
                    onChange={(e) => setNewMaintenanceWindow({ ...newMaintenanceWindow, description: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleScheduleMaintenance} className="mt-4">
                Schedule Maintenance
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduled Maintenance</CardTitle>
              <CardDescription>Upcoming and past maintenance windows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceWindows.map((window) => (
                  <div key={window.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{window.title}</h3>
                      <Badge variant={getStatusBadgeVariant(window.status)}>
                        {window.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{window.description}</p>
                    <div className="text-sm">
                      <div>Start: {window.scheduledStart.toLocaleString()}</div>
                      <div>End: {window.scheduledEnd.toLocaleString()}</div>
                      <div className="mt-2">
                        Affected Services: {window.affectedServices.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Database Backup</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleBackupNow('database')} className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Backup Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Files Backup</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleBackupNow('files')} className="w-full">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Backup Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Full System Backup</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleBackupNow('full')} className="w-full">
                  <Server className="h-4 w-4 mr-2" />
                  Backup Now
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>Recent backup operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backupHistory.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {backup.type === 'database' && <Database className="h-5 w-5" />}
                        {backup.type === 'files' && <HardDrive className="h-5 w-5" />}
                        {backup.type === 'full' && <Server className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{backup.type} Backup</div>
                        <div className="text-sm text-muted-foreground">
                          {backup.created.toLocaleString()} • {backup.size}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(backup.status)}>
                        {backup.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{systemMetrics.cpuUsage}%</div>
                <Progress value={systemMetrics.cpuUsage} className="mb-2" />
                <p className="text-sm text-muted-foreground">Normal usage level</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{systemMetrics.memoryUsage}%</div>
                <Progress value={systemMetrics.memoryUsage} className="mb-2" />
                <p className="text-sm text-muted-foreground">Moderate usage level</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Disk Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{systemMetrics.diskUsage}%</div>
                <Progress value={systemMetrics.diskUsage} className="mb-2" />
                <p className="text-sm text-muted-foreground">Low usage level</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Network Traffic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{systemMetrics.networkTraffic}</div>
                <p className="text-sm text-muted-foreground">Daily average traffic</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}