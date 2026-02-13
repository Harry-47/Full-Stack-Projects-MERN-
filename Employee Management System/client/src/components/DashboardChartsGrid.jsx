import { motion } from "framer-motion";
import { FaChartBar, FaChartPie } from "react-icons/fa";
import CustomBarChart from "./CustomBarChart";
import CustomPieChart from "./CustomPieChart";
import { itemVariants } from "../utils/variants"; 

const DashboardChartsGrid = ({ 
  barData, 
  pieData, 
  barTitle = "Performance", 
  pieTitle = "Overview", 
  xKey = "name", 
  yKey = "score",
  barColor = "#3b82f6",
  children // for the assign button of manager
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* BAR CHART SECTION (Left Side - Takes 2 Columns) */}
      <motion.div
        variants={itemVariants}
        className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 h-[450px] flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <span className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <FaChartBar className="text-sm" />
            </span>
            {barTitle}
          </h3>
        </div>

        <div className="flex-1 w-full min-h-0">
          <CustomBarChart
            data={barData}
            xKey={xKey}
            yKey={yKey}
            color={barColor}
          />
        </div>
      </motion.div>

      {/* PIE CHART SECTION (Right Side - Takes 1 Column) */}
      <div className="flex flex-col gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 min-h-[350px]"
        >
          <h3 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-3">
            <span className="p-2 bg-cyan-50 rounded-xl text-cyan-600">
              <FaChartPie className="text-sm" />
            </span>
            {pieTitle}
          </h3>
          <div className="relative h-[250px] w-full">
            <CustomPieChart data={pieData} />
          </div>
        </motion.div>

        {/* here will come the extra things like assign button in case of manager dashboard page  */}
        {children && (
          <motion.div variants={itemVariants}>
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardChartsGrid;