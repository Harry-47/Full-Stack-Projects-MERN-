import { motion } from "framer-motion";
import UserCard from "../../../../components/UserCard";

const EmployeeGrid = ({ displayData, deleteEmployee }) => {
  return (
    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayData.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          onDelete={() => deleteEmployee(user._id)}
          isDeleteAllowed={true}
        />
      ))}
    </motion.div>
  );
};

export default EmployeeGrid;