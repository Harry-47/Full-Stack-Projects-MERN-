import { motion } from "framer-motion";
import { FaInbox } from "react-icons/fa";
import Header from "../../../components/Header";
import TaskActionCard from "./TaskActionCard";

const RenderTasks = ({ 
  tasks,  
  activeTab, 
  setActiveTab, 
  onProcessAction, 
  onSubmit, 
  onReview, 
  isSubmitting 
}) => {
  
  const tabs = [
    { id: "pending", label: "New Missions" },
    { id: "ongoing", label: "In Progress" },
    { id: "all", label: "History" },
  ];

  const role = localStorage.getItem("role")

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-6 lg:p-12 poppins-regular">
      <Header 
        title={role === "manager" ? "TEAM MISSIONS" : "MY MISSIONS"} 
        subtitle="Track and execute assignments across the grid"
      />

      {/* --- Dynamic Tabs --- */}
      <div className="flex justify-center gap-4 mb-10 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id ? "bg-black text-white shadow-lg" : "bg-white text-gray-400 border border-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskActionCard 
                key={task._id} 
                task={task} 
                role={role}
                onProcessAction={onProcessAction}
                onSubmit={onSubmit}
                onReview={onReview}
                isSubmitting={isSubmitting} 
              />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100"
          >
            <div className="bg-gray-50 p-8 rounded-full mb-4">
              <FaInbox className="text-gray-200 text-6xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tighter">No {activeTab} missions!</h3>
            <p className="text-gray-400 text-sm mt-2">No Tasks! ☕</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RenderTasks;