import { useQuery } from "@tanstack/react-query";
import { fetchAdminCategoryProducts } from "../utils/fetchAdminCategoryProducts";

export const useAdminCategoryProducts = (category, filters) => {
    return useQuery({
        queryKey: ['admin', 'products', 'category', category, filters],
        queryFn: () => fetchAdminCategoryProducts(category, filters),
        staleTime: 1000 * 60 * 5,
    });
};