"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { loginSchema } from "@/lib/validations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SuperAdminAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, login, error } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  // Form setup with react-hook-form and zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  useEffect(() => {
    // Only redirect if authentication loading is complete
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "super_admin") {
        router.push("/sadmin/dashboard");
      } else if (user.role === "museum_admin") {
        router.push("/admin/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Update error state when auth context error changes
  useEffect(() => {
    setAuthError(error);
  }, [error]);

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    try {
      await login(data);
      // After successful login, check if user has super admin role
      if (user && user.role !== "super_admin") {
        setAuthError("Access denied. Super admin privileges required.");
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      // Error is handled by the auth context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <circle cx="12" cy="16" r="1"></circle>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-playfair font-bold text-primary mb-2">MuseumConnect</h1>
          <p className="text-muted-foreground font-medium">Super Administrator Access</p>
        </div>

        <Card className="border-destructive/20 shadow-lg">
          <CardHeader className="bg-destructive/5 rounded-t-lg">
            <CardTitle className="text-destructive">Super Admin Sign In</CardTitle>
            <CardDescription>
              Enter your super administrator credentials to access the platform control panel
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {authError && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>{authError}</div>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your super admin username"
                          {...field}
                          autoComplete="username"
                          className="border-destructive/20 focus:border-destructive"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your super admin password"
                          {...field}
                          autoComplete="current-password"
                          className="border-destructive/20 focus:border-destructive"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-destructive hover:bg-destructive/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Access Control Panel"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <a href="/" className="text-sm text-primary hover:underline">
                Return to Public Website
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Super Administrator Demo Credentials:</p>
          <p className="mt-1 font-medium text-destructive">admin / admin123</p>
        </div>
      </div>
    </div>
  );
}
