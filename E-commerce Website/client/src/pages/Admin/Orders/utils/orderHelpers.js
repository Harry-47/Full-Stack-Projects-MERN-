import axiosApi from "../../../../utils/axiosInstance";

// 1. API Calls
export const fetchAdminOrders = async (keyword = "") => {
    const endpoint = keyword 
        ? `/admin/orders/search?keyword=${encodeURIComponent(keyword)}`
        : '/admin/orders';
    const { data } = await axiosApi.get(endpoint);
    return data;
};

export const deleteOrderApi = async (orderId) => {
    const { data } = await axiosApi.delete(`/admin/orders/${orderId}`);
    return data;
};

// 2. Chart Calculation Logic (Heavy lifting moved out of component)
export const calculateOrderStats = (orders) => {
    const monthlyRevenue = {};
    const statusCount = { "Pending": 0, "Shipped": 0, "Delivered": 0, "Canceled": 0 };

    orders.forEach(order => {
        const date = new Date(order.createdAt);
        const key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

        monthlyRevenue[key] = (monthlyRevenue[key] || 0) + order.totalPrice;
        if (statusCount.hasOwnProperty(order.status)) {
            statusCount[order.status]++;
        }
    });

    return {
        revenueData: Object.keys(monthlyRevenue).map(key => ({ name: key, Revenue: monthlyRevenue[key] })),
        statusData: Object.keys(statusCount).map(key => ({ name: key, value: statusCount[key] }))
    };
};

export const PIE_COLORS = ['#FFC107', '#2196F3', '#4CAF50', '#F44336'];