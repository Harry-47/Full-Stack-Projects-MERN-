import {
  FaUsers,
  FaTasks,
  FaClipboardCheck,
  FaPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StatsCard from "../../../../components/StatsCard";
import Header from "../../../../components/Header";
import DashboardChartsGrid from "../../../../components/DashboardChartsGrid";
import { containerVariants, itemVariants } from "../../../../utils/variants";

const RenderManagerDashboard = ({ data }) => {
  const { stats, performance, taskDistribution } = data || {};

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-[#F5F5F7] text-gray-900 p-6 lg:p-12 font-sans poppins-regular"
    >
      <div className="max-w-7xl mx-auto">
        <Header title="DASHBOARD" subtitle="Overview & Statistics" />

        {/* 1. CARDS SECTION */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          <motion.div variants={itemVariants}>
            <StatsCard title="Total Team" value={stats.totalEmployees} icon={<FaUsers />} role="manager" type="employees" color="blue" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard title="Active Missions" value={stats.activeTasks} icon={<FaTasks />} role="manager" type="tasks" color="cyan" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard title="Pending Reviews" value={stats.pendingReviews} icon={<FaClipboardCheck />} role="manager" type="reviews" color="yellow" />
          </motion.div>
        </motion.div>

        {/* 2. REUSABLE CHARTS GRID */}
        <DashboardChartsGrid
          barData={performance}
          pieData={taskDistribution}
          barTitle="Team Performance"
          pieTitle="Task Distribution"
          xKey="name"
          yKey="score"
        >
          {/* 👇 this button is being passed as children so that it will be renderd along with the charts too  */}
          <Link to="/manager/assign-task" className="w-full block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-6 bg-gray-900 text-white rounded-[1.8rem] font-bold text-lg shadow-xl shadow-gray-200 flex items-center justify-center gap-3 transition-all duration-300 group"
            >
              <FaPlus className="bg-white/20 p-1 rounded-full text-2xl" />
              Assign New Task
            </motion.button>
          </Link>
        </DashboardChartsGrid>

      </div>
    </motion.div>
  );
};

export default RenderManagerDashboard;