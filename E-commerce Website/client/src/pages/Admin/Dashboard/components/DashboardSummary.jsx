import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBox, FaFileAlt, FaUsers } from "react-icons/fa";

const DashboardSummary = ({ totalProducts, totalOrders, totalUsers }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 poppins-regular">
            <SummaryCard link="/admin/dashboard/products" icon={<FaBox className="text-3xl" />} title="Products" value={totalProducts} color="text-blue-600" />
            <SummaryCard link="/admin/dashboard/orders" icon={<FaFileAlt className="text-3xl" />} title="Orders" value={totalOrders} color="text-green-600" />
            <SummaryCard link="/admin/dashboard/users" icon={<FaUsers className="text-3xl" />} title="Users" value={totalUsers} color="text-purple-600" />
        </div>
    );
};

const SummaryCard = ({ link, icon, title, value, color }) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
        <Link to={link} className="bg-white p-10 flex flex-col items-center transition-all duration-300 relative group overflow-hidden rounded-4xl shadow-md">
            <h2 className={`text-xl font-semibold mb-4 flex items-center gap-3 ${color} relative z-10`}>{icon} {title}</h2>
            <p className="text-5xl font-extrabold text-gray-900 relative z-10">{value}</p>
            <span className="absolute top-0 left-0 w-10 h-full bg-white/20 -skew-x-12 transform -translate-x-full group-hover:translate-x-[1300%] transition-all duration-2000 ease-out"></span>
        </Link>
    </motion.div>
);

export default DashboardSummary;