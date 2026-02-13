import { motion } from "framer-motion";
import { FaChartLine, FaChartPie, FaChartBar } from "react-icons/fa";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const pieChartColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const DashboardCharts = ({ salesData, topSellingProducts, lowStockProducts }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Sales Trend */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }} className="bg-white p-8 rounded-4xl shadow-xl flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 text-black mb-6">
                    <FaChartLine className="text-2xl" />
                    <h3 className="text-2xl font-bold">Monthly Sales Trend</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Top Products Pie */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 1.0 }} className="bg-white p-8 rounded-4xl shadow-xl flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 text-black mb-6">
                    <FaChartPie className="text-2xl" />
                    <h3 className="text-2xl font-bold">Top Selling Products</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={topSellingProducts} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                            {topSellingProducts.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Low Stock Bar */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 1.2 }} className="bg-white p-8 rounded-4xl shadow-xl flex flex-col items-center justify-center lg:col-span-2">
                <div className="flex items-center gap-3 text-black mb-6">
                    <FaChartBar className="text-2xl" />
                    <h3 className="text-2xl font-bold">Low Stock Products</h3>
                </div>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={lowStockProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="title" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="stock" fill="#ff6663" />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};

export default DashboardCharts;