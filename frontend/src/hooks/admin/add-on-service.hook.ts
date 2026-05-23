import { addOnServiceApi } from "@/api/admin/add-on-service.api";
import type { GetAddOnServicesQuery } from "@/types/admin/add-on-service.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useCreateAddOnServiceMutation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["add-on-service", "create"],
        mutationFn: addOnServiceApi.createAddOnService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["add-on-service", "list"] });
            queryClient.invalidateQueries({ queryKey: ["add-on-service", "stats"] });
            navigate("/admin/add-on-service");
        },
    });
};

export const useGetAddOnServicesQuery = (query: GetAddOnServicesQuery) => {
    return useQuery({
        queryKey: ["add-on-service", "list", query],
        queryFn: () => addOnServiceApi.getAddOnServices(query),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    });
};

export const useGetAddOnServiceStatsQuery = () => {
    return useQuery({
        queryKey: ["add-on-service", "stats"],
        queryFn: addOnServiceApi.getAddOnServiceStats,
        refetchOnWindowFocus: false,
    });
};

export const useGetAddOnServiceById = (id: string | undefined | null) => {
    return useQuery({
        queryKey: ["add-on-service", "byId", id],
        queryFn: () => addOnServiceApi.getAddOnServiceById(id || ""),
        enabled: !!id,
        refetchOnWindowFocus: false,
        retry: false,
    });
};

export const useUpdateAddOnServiceMutation = (id: string) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["add-on-service", "update", id],
        mutationFn: (data: any) => addOnServiceApi.updateAddOnService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["add-on-service", "list"] });
            queryClient.invalidateQueries({ queryKey: ["add-on-service", "byId", id] });
            queryClient.invalidateQueries({ queryKey: ["add-on-service", "stats"] });
            navigate("/admin/add-on-service");
        },
    });
};

export const useDeleteAddOnServiceMutation = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["add-on-service", "delete", id],
        mutationFn: () => addOnServiceApi.deleteAddOnService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["add-on-service", "list"] });
            queryClient.invalidateQueries({ queryKey: ["add-on-service", "stats"] });
        },
    });
};
