import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useApiQuery<T>(endpoint: string) {
    return useQuery<T[]>({
        queryKey: [endpoint],
        queryFn: async () => {
            const res = await api.get(`/portfolio/${endpoint}`);
            return Array.isArray(res.data) ? res.data : [res.data];
        },
    });
}

export function useApiAdd<T>(endpoint: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newData: Partial<T>) => {
            const res = await api.post(`/portfolio/${endpoint}`, newData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [endpoint] });
        },
    });
}

export function useApiUpdate<T>(endpoint: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) => {
            if (endpoint === "profile" || endpoint === "about") {
                const res = await api.put(`/portfolio/${endpoint}`, data);
                return res.data;
            }
            const res = await api.put(`/portfolio/${endpoint}/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [endpoint] });
        },
    });
}

export function useApiDelete(endpoint: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/portfolio/${endpoint}/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [endpoint] });
        },
    });
}
