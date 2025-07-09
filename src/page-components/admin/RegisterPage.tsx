"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import {
  loginSchema,
  RegisterCredentials,
  registerDataSchema,
} from "@/lib/validations";
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
import Link from "next/link";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, login, error } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  // Form setup with react-hook-form and zod validation
  const form = useForm<RegisterCredentials>({
    resolver: zodResolver(registerDataSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    // Only redirect if authentication loading is complete
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "museum_admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "super_admin") {
        router.push("/sadmin/dashboard");
      }
      // Note: Don't redirect to home for invalid roles on auth pages
      // Let them see the login form with an appropriate error message
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
    } catch (error) {
      console.error("Login error:", error);
      // Error is handled by the auth context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-destructive"
            >
              <path d="M2 20h20"></path>
              <path d="M5 4v16"></path>
              <path d="M5 4h14"></path>
              <path d="M5 12h14"></path>
              <path d="M12 4v16"></path>
              <path d="M19 4v16"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-playfair font-bold text-primary mb-2">
            MuseumConnect
          </h1>
          <p className="text-muted-foreground">Administrator Access</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authError && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>{authError}</div>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          autoComplete="fullname"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username"
                          {...field}
                          autoComplete="username"
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
                          placeholder="Enter your password"
                          {...field}
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-primary">
                Already have an account?{" "}
                <Link href="/register" className=" hover:text-yellow-700">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>For demo purposes:</p>
          <p className="mt-1">
            Museum Admin: <span className="font-medium">sarah / pass123</span>
          </p>
          <p>
            Super Admin: <span className="font-medium">admin / admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
