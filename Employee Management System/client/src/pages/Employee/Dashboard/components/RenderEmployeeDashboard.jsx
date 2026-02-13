import { motion } from "framer-motion";
import { FaTasks, FaChartLine } from "react-icons/fa";
import Header from "../../../../components/Header";
import StatsCard from "../../../../components/StatsCard";
import DashboardChartsGrid from "../../../../components/DashboardChartsGrid";
import { containerVariants, itemVariants } from "../../../../utils/variants"; 

const RenderEmployeeDashboard = ({ data, id }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`min-h-screen bg-[#F5F5F7] p-6 lg:p-12 poppins-regular`}
    >
      <div className="max-w-7xl mx-auto">
        <Header 
          title={id ? data.name : `MY PROGRESS`} 
          subtitle={id ? 'PERFORMANCE STATS' : `Your performance overview`} 
        />

        {/* 1. CARDS SECTION */}
        <motion.div 
           variants={containerVariants}
           className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-8 ${id ? 'pointer-events-none' : ''}`}
        >
          <motion.div variants={itemVariants}>
             <StatsCard title="Ongoing Tasks" value={data?.stats?.ongoingTasks} icon={<FaTasks />} type="tasks" color="cyan" />
          </motion.div>
          <motion.div variants={itemVariants}>
             <StatsCard title="Score" value={data?.score} icon={<FaChartLine />} type="performance" color="yellow" />
          </motion.div>
          {/* Employee doesnt have any 3rd card so it will be adjusted */}
        </motion.div>

        {/* 2. REUSABLE CHARTS GRID */}
        <DashboardChartsGrid
          barData={data?.performanceData}
          pieData={data?.taskDistribution}
          barTitle="Monthly Growth"
          pieTitle="Task Status"
          xKey="month" 
          yKey="score"
          barColor="#06b6d4"
        />
        
      </div>
    </motion.div>
  );
};

export default RenderEmployeeDashboard;