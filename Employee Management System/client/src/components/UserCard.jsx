import { motion } from "framer-motion";
import { FaUserCircle, FaEnvelope, FaPhone, FaBriefcase, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserCard = ({ user, onDelete, isDeleteAllowed = true }) => {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative group overflow-hidden cursor-pointer" onClick={() => navigate(`/manager/dashboard/employees/${user._id}`)}
    >
      {/* 🔴 Delete Button (Top Right) - Only if Allowed, the scene is that on employees page it is allowed but on the assign task page , deletion operation is not allowed  */}
      {isDeleteAllowed && (
        <button
          onClick={() => onDelete(user._id)}
          className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 cursor-pointer rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500 hover:text-white shadow-sm z-10"
          title="Remove Employee"
        >
          <FaTrash size={14} />
        </button>
      )}

      {/* 🖼️ Profile Pic (Top Center) */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full border-4 border-gray-50 overflow-hidden shadow-inner">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              <FaUserCircle size={40} />
            </div>
          )}
        </div>
      </div>

      {/* 📝 Main Details (Black) */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 truncate">{user.name}</h3>
        <p className="text-sm text-gray-500 font-medium truncate">{user.email}</p>
      </div>

      {/* ➖ Separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>

      {/* ℹ️ Further Details (Greyish with Icons) */}
      <div className="space-y-2 text-sm text-gray-500">
        
        {/* Role / Category */}
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
          <FaBriefcase className="text-blue-500" />
          <span className="font-medium capitalize">{user.category || "General Employee"}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
          <FaPhone className="text-green-500" />
          <span className="font-mono">{user.number || "N/A"}</span>
        </div>
        
        {/* Email again (optional, or maybe Bio) */}
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg truncate">
          <FaEnvelope className="text-purple-500" />
          <span className="truncate" title={user.email}>{user.email}</span>
        </div>

      </div>
    </motion.div>
  );
};

export default UserCard;