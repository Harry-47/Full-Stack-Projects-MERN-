import { queryClient } from '../../../../main'; 
import { fetchDashboardData } from "../utils/dashboardHelpers";

const AdminDashboardLoader = async () => {
    try {
        await queryClient.prefetchQuery({
            queryKey: ['admin', 'dashboard'],
            queryFn: fetchDashboardData
        });
        return null;
    } catch (error) {
        console.error('Dashboard prefetch error:', error);
        return null;
    }
};

export default AdminDashboardLoader;