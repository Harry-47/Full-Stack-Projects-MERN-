import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchDashboardData, logoutApi } from "../utils/dashboardHelpers";
import { toast } from "react-toastify";

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: fetchDashboardData,
        staleTime: 1000 * 60 * 5, // 5 Mins cache
    });
};

export const useAdminLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            queryClient.clear(); // Clear all cache on logout
            toast.success("Logged out successfully! 👋");
            navigate('/auth/login'); // Redirect to login
        },
        onError: (error) => {
            console.error('Logout error:', error);
            toast.error("Logout failed. Please try again.");
        }
    });
};