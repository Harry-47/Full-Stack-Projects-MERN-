import { useQuery } from "@tanstack/react-query";
import { fetchAdminProducts } from "../utils/fetchAdminProducts";

export const useAdminProducts = () => {
    return useQuery({
        queryKey: ['admin', 'products', 'listing'],
        queryFn: fetchAdminProducts,
        staleTime: 1000 * 60 * 5, // Cache remains fresh for 5 minutes
    });
};