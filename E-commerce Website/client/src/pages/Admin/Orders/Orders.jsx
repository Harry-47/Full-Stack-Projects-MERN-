import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../../components/SearchBar";
import { useAdminOrders } from "./hooks/useAdminOrders";
import OrdersCharts from "./components/OrderCharts";
import OrdersGrid from "./components/OrdersGrid";
import LoadingSpinner from "../../../components/LoadingSpinner";

const Orders = () => {
    const [query, setQuery] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");

    // Hook returns processed data directly
    const { data, isLoading } = useAdminOrders(appliedSearch);

    // Handlers
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setAppliedSearch(query);
    };

    if (isLoading) return <LoadingSpinner />;

    const { orders, stats } = data || { orders: [], stats: { revenueData: [], statusData: [] } };

    return (
        <>
            <Navbar page={"admin-order"} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-gray-100 p-8 poppins-regular">
                
                <OrdersCharts 
                    revenueData={stats.revenueData} 
                    statusData={stats.statusData} 
                />

                <OrdersGrid 
                    orders={orders} 
                    query={query} 
                    setQuery={setQuery} 
                    onSearch={handleSearchSubmit} 
                />

            </motion.div>
        </>
    );
};

export default Orders;