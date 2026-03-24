import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export type AuthUser = { id: number; username: string };

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ["/api/me"],
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return { user: user ?? null, isLoading };
}

export function useLogin() {
  const [, navigate] = useLocation();
  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return res.json() as Promise<AuthUser>;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/me"], user);
      navigate("/crm");
    },
  });
}

export function useLogout() {
  const [, navigate] = useLocation();
  return useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/me"], null);
      navigate("/login");
    },
  });
}

export function useRegister() {
  const [, navigate] = useLocation();
  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return res.json() as Promise<AuthUser>;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/me"], user);
      navigate("/crm");
    },
  });
}
