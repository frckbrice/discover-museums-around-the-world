"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LoginCredentials, RegisterCredentials } from "@/lib/validations";
import { toast } from "sonner";
import { API_URL } from "@/lib/constants";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  register: (credentials: RegisterCredentials) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  error: null,
  register: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch current user session data
  const {
    data: user,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["/auth/session"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(`${API_URL}${queryKey[0]}`, {
          credentials: "include",
        });

        if (res.status === 401) {
          return null;
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch user session: ${res.statusText}`);
        }

        return res.json();
      } catch (error: any) {
        console.error("Session fetch error:", error);
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiRequest("POST", "/auth/login", credentials);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/auth/session"], data);

      toast.success(`Welcome back, ${data.fullName}!`);

      setError(null);

      // Redirect based on user role
      if (data.role === "super_admin") {
        window.location.href = "/sadmin/dashboard";
      } else {
        window.location.href = "/admin/dashboard";
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please check your credentials.");

      toast.error(error.message || "Invalid username or password");
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userDetails: RegisterCredentials) => {
      const res = await apiRequest("POST", "/auth/register", userDetails);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/auth/session"], data);

      toast.success(
        `Welcome, ${data.fullName}! Your account has been created.`
      );

      setError(null);

      // Redirect based on user role
      if (data.role === "super_admin") {
        window.location.href = "/sadmin/dashboard";
      } else {
        window.location.href = "/admin/dashboard";
      }
    },
    onError: (error: any) => {
      console.error("Register error:", error);
      setError(
        error.message || "Registration failed. Please check your input."
      );

      toast.error(error.message || "Registration failed");
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/auth/logout");
      return res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/auth/session"], null);

      toast("You have been successfully logged out");

      // Redirect to home page
      window.location.href = "/";
    },
    onError: (error: any) => {
      console.error("Logout error:", error);

      toast.error("There was a problem logging out");
    },
  });

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (credentials: RegisterCredentials) => {
    await registerMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Update auth state when the token is about to expire
  useEffect(() => {
    if (user?.expiresAt) {
      const expiresAt = new Date(user.expiresAt).getTime();
      const now = Date.now();
      const timeToExpire = expiresAt - now;

      // Refresh token 5 minutes before expiration
      if (timeToExpire > 0 && timeToExpire < 1000 * 60 * 5) {
        const refreshTimer = setTimeout(() => {
          refetchUser();
        }, timeToExpire - 1000 * 60 * 5);

        return () => clearTimeout(refreshTimer);
      }
    }
  }, [user, refetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        error,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
