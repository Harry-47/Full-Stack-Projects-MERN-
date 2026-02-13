import { useQuery } from "@tanstack/react-query";
import { fetchAdminOrders, calculateOrderStats } from "../utils/orderHelpers";

export const useAdminOrders = (appliedSearch) => {
    return useQuery({
        queryKey: ['admin', 'orders', appliedSearch],
        queryFn: () => fetchAdminOrders(appliedSearch),
        staleTime: 1000 * 60 * 5,
        retry: false,
        // ⭐ Magic: Data aate hi calculate kar lo, component mein nahi
        select: (data) => ({
            orders: data,
            stats: calculateOrderStats(data)
        })
    });
};