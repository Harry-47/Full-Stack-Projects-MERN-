import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchUsers, deleteUserApi } from "../utils/adminUserActions";

export const useUsers = (appliedSearch) => {
    return useQuery({
        queryKey: ['admin', 'users', appliedSearch],
        queryFn: () => fetchUsers(appliedSearch),
        staleTime: 1000 * 60 * 5,
        retry: false
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUserApi,
        onSuccess: () => {
            // ⭐ Invalidate queries to refresh list without page reload
            queryClient.invalidateQueries(['admin', 'users']);
            toast.success("User Deleted Successfully! ✅");
        },
        onError: (err) => {
            const message = err.response?.data?.message || "Delete operation failed";
            toast.error(message);
        }
    });
};