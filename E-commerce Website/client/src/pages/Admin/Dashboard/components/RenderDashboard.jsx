import { motion } from "framer-motion";
import { FaSignOutAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { ImCool } from "react-icons/im";
import { Link } from "react-router-dom";
import DashboardCharts from "./DashboardCharts";
import DashboardSummary from "./DashboardSummary";

const RenderDashboard = ({ data, onLogout, isLoggingOut }) => {
    const { adminName, totalProducts, totalOrders, totalUsers, salesData, topSellingProducts, lowStockProducts } = data;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="min-h-screen text-gray-800 p-8 bg-gradient-to-br from-gray-50 to-blue-50 poppins-regular">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <ImCool className="animate-spin duration-300 text-4xl" />
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-black via-gray-500 to-blue-500 bg-clip-text text-transparent">Admin Dashboard</h1>
                </div>
                <motion.button
                    onClick={onLogout}
                    disabled={isLoggingOut}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-3 px-8 text-white font-bold bg-black hover:bg-gray-800 transition-colors duration-300 rounded-4xl shadow-lg flex items-center justify-center relative group overflow-hidden cursor-pointer gap-2 disabled:opacity-70"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <FaSignOutAlt className="text-xl" /> {isLoggingOut ? '...' : 'Logout'}
                    </span>
                    <span className="absolute top-0 left-0 w-10 h-full bg-white/20 -skew-x-12 transform -translate-x-full group-hover:translate-x-[270%] transition-all duration-700 ease-out"></span>
                </motion.button>
            </div>

            {/* Welcome Msg */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mb-12 p-8 bg-white rounded-4xl shadow-xl border-t-4 border-blue-500">
                <h2 className="text-4xl font-bold mb-2">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-500 to-blue-500">{adminName}</span>!
                </h2>
                <p className="text-lg text-gray-600">Here's a quick overview of your store's performance at a glance. ✨</p>
            </motion.div>

            {/* Content Modules */}
            <DashboardSummary totalProducts={totalProducts} totalOrders={totalOrders} totalUsers={totalUsers} />
            
            <DashboardCharts salesData={salesData} topSellingProducts={topSellingProducts} lowStockProducts={lowStockProducts} />

            {/* Add Product Button */}
            <div className="flex justify-center">
                <Link to="/admin/dashboard/add-product" className="bg-black text-white font-bold hover:bg-gray-800 transition-colors duration-300 rounded-4xl shadow-lg flex items-center justify-center relative group overflow-hidden cursor-pointer gap-2 py-4 px-10 text-lg">
                    <IoMdAdd className="text-xl" /> Add New Product
                    <span className="absolute top-0 left-0 w-10 h-full bg-white/20 -skew-x-12 transform -translate-x-full group-hover:translate-x-[690%] transition-all duration-700 ease-out"></span>
                </Link>
            </div>
        </motion.div>
    );
};

export default RenderDashboard;