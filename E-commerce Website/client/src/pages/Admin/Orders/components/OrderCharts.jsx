import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PIE_COLORS } from "../utils/orderHelpers";
import { motion } from "framer-motion";
const OrdersCharts = ({ revenueData, statusData }) => {
    return (
        <div className="bg-white rounded-2xl p-14 shadow-lg mb-8 h-auto w-full">
            <motion.center
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.0 , delay: 1.0}}
            className="text-2xl font-bold mb-10 text-gray-800">📊 Dashboard Insights</motion.center>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Bar Chart */}
                <div className="w-full lg:w-1/2 h-80">
                    <h3 className="text-center text-xl font-semibold mb-4">Revenue over Time</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Revenue" fill="#2196F3" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="w-full lg:w-1/2 h-80">
                    <h3 className="text-center text-xl font-semibold mb-4">Order Status Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default OrdersCharts;