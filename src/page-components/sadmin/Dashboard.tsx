"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Analytic, Museum } from "@/types";

export default function SuperAdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect if not authenticated or not super admin
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/sadmin/auth");
    } else if (!authLoading && isAuthenticated && user?.role !== "super_admin") {
      router.push("/admin/dashboard");
    }
  }, [authLoading, isAuthenticated, router, user]);

  // Fetch dashboard stats
  const { data: statsData, isLoading: statsLoading } = useQuery<any>({
    queryKey: ['/sadmin/stats'],
    enabled: isAuthenticated && user?.role === "super_admin",
  });

  // Loading state
  if (authLoading || statsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>

        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Platform Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || 'Administrator'}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">Total Museums</p>
              <h2 className="text-3xl font-bold">{statsData?.totalMuseums || 0}</h2>
              <p className="text-xs text-muted-foreground">
                {statsData?.pendingMuseums || 0} pending approval
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">Total Stories</p>
              <h2 className="text-3xl font-bold">{statsData?.totalStories || 0}</h2>
              <p className="text-xs text-muted-foreground">
                {statsData?.pendingStories || 0} pending moderation
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">Media Items</p>
              <h2 className="text-3xl font-bold">{statsData?.totalMedia || 0}</h2>
              <p className="text-xs text-muted-foreground">
                Across {statsData?.uniqueGalleries || 0} galleries
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h2 className="text-3xl font-bold">{statsData?.totalUsers || 0}</h2>
              <p className="text-xs text-muted-foreground">
                {statsData?.activeUsers || 0} active this month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform activity */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Platform Activity</CardTitle>
              <CardDescription>
                Recent actions across all museums
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statsData?.recentActivity?.length ? (
                <div className="space-y-4">
                  {statsData.recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex items-start gap-4 border-b pb-4">
                      <div className="bg-primary/10 text-primary p-2 rounded">
                        {activity.icon || "📝"}
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">No recent activity found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>
                Visitor statistics and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>
                Alerts and important messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
                  <p className="font-medium">System Maintenance</p>
                  <p className="text-sm mt-1">Scheduled maintenance will occur on May 25, 2025, from 2:00 AM to 4:00 AM UTC.</p>
                </div>
                <div className="p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
                  <p className="font-medium">New Feature Available</p>
                  <p className="text-sm mt-1">3D artifact viewing is now available in the media gallery.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}