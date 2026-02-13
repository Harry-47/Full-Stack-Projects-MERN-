import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon, type, color }) => {
  // 🧠 Logic: Route determination based on Role & Type
  let route = "/";
  let role = localStorage.getItem("role") //role is set to localStorage upon login

  if (role === "manager") {
    if (type === "employees") route = "/manager/employees";
    if (type === "tasks") route = "/manager/tasks?status=ongoing";
    if (type === "reviews") route = "/manager/reviews";
  } else if (role === "employee") {
    if (type === "tasks") route = `/employee/tasks`; 
    if (type === "completed") route = `/employee/tasks?status=completed`; 
    if (type === "performance") route = `/employee/performance`; 
    // Add logic for employee routes
  }

  // Dynamic Tailwind Classes based on color prop (e.g., 'cyan', 'blue', 'yellow')
  const colorClasses = {
    blue: "text-blue-400 group-hover:bg-blue-500 bg-blue-500/20 group-hover:border-blue-400/50",
    cyan: "text-cyan-400 group-hover:bg-cyan-500 bg-cyan-500/20 group-hover:border-cyan-400/50",
    yellow:
      "text-yellow-400 group-hover:bg-yellow-500 bg-yellow-500/20 group-hover:border-yellow-400/50",
  };

  const activeColor = colorClasses[color] || colorClasses.blue;

  return (
    <Link to={route} className="block w-full">
      <motion.div
        whileHover={{ y: -5 }}
        className={`bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md cursor-pointer group transition-all hover:shadow-lg ${activeColor.split(" ").pop()}`}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1 font-semibold">
              {title || "Title"}
            </p>
            <h2 className={`text-4xl font-black ${activeColor.split(" ")[0]}`}>
              {value || 0}
            </h2>
          </div>
          <div
            className={`p-3 rounded-xl text-2xl group-hover:text-white transition-all ${activeColor.split(" ").slice(0, 3).join(" ")}`}
          >
            {icon || "📊"}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default StatsCard;
