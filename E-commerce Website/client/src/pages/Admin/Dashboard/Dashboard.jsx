import { useAdminDashboard, useAdminLogout } from "./hooks/useAdminDashboard";
import RenderDashboard from "./components/RenderDashboard";
import LoadingSpinner from "../../../components/LoadingSpinner";

const AdminDashboard = () => {
    const { data, isLoading } = useAdminDashboard();
    const { mutate: logout, isPending: isLoggingOut } = useAdminLogout();

    if (isLoading) return <LoadingSpinner />;
    const safeData = {
        adminName: data?.adminName || "Admin",
        totalProducts: data?.totalProducts || 0,
        totalOrders: data?.totalOrders || 0,
        totalUsers: data?.totalUsers || 0,
        salesData: data?.salesData || [],
        topSellingProducts: data?.topSellingProducts || [],
        lowStockProducts: data?.lowStockProducts || []
    };

    return (
        <RenderDashboard 
            data={safeData} 
            onLogout={() => logout()}
            isLoggingOut={isLoggingOut} 
        />
    );
};

export default AdminDashboard;