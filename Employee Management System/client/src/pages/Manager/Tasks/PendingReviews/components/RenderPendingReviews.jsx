import { motion } from "framer-motion";
import Header from "../../../../../components/Header";
import ReviewCard from "./ReviewCard";

const RenderPendingReviews = ({ tasks, updateStatus }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] p-6 lg:p-12 poppins-regular">
      <Header title="PENDING REVIEWS" subtitle="Check and verify submissions"/>

      <div className="max-w-7xl mx-auto mt-8">
        {tasks?.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task) => (
              <ReviewCard key={task._id} task={task} updateStatus={updateStatus} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <p className="text-lg font-medium">No tasks waiting for review. ☕</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenderPendingReviews;