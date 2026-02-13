import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlay, FaCloudUploadAlt, FaExclamationTriangle, 
  FaCheckCircle, FaHourglassHalf, FaInfoCircle, FaSave 
} from "react-icons/fa";

const TaskActionCard = ({ task, role, onProcessAction, onSubmit, onReview, isSubmitting }) => {
  const [showForm, setShowForm] = useState(false);
  const [actionType, setActionType] = useState(""); 
  const isEmployeeRejection = task.status === "failed" && !task.submission?.submittedAt;

  // 🎨 Status UI Config
  const statusConfig = {
    pending: { color: "bg-cyan-50 text-cyan-600 border-cyan-100", icon: <FaInfoCircle />, label: "New Mission" },
    ongoing: { color: "bg-blue-50 text-blue-600 border-blue-100", icon: <FaPlay className="text-[8px]" />, label: "In Progress" },
    completed: { color: "bg-yellow-50 text-yellow-600 border-yellow-100", icon: <FaHourglassHalf />, label: "Pending Review" },
    accepted: { color: "bg-green-50 text-green-600 border-green-100", icon: <FaCheckCircle />, label: "Success" },
    failed: { 
      color: "bg-red-50 text-red-600 border-red-100", 
      icon: <FaExclamationTriangle />, 
      label: isEmployeeRejection ? "Employee Rejected" : "Mission Failed"
    }
  };

  const currentStatus = statusConfig[task.status] || statusConfig.pending;

  // 🧠 Handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const reason = formData.get("reason");

    if (actionType === "submit") {
      onSubmit({ taskId: task._id, formData });
    } else if (actionType === "reject") {
      onProcessAction({ taskId: task._id, action: "reject", failedReason: reason });
    } else if (actionType === "review_fail") {
      onReview({ taskId: task._id, status: "failed", failedReason: reason });
    }
    setShowForm(false);
  };

  return (
    <div className={`bg-white p-6 rounded-[2.5rem] border shadow-sm transition-all flex flex-col h-full ${task.status === "failed" ? "border-red-100" : "border-gray-100"}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase flex items-center gap-1.5 border ${currentStatus.color}`}>
          {currentStatus.icon} {currentStatus.label}
        </span>
        <p className="text-gray-400 text-[10px] font-bold tracking-widest">
          {new Date(task.date).toLocaleDateString()}
        </p>
      </div>

      {/* Body */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
        <p className="text-sm text-gray-500 mb-6 line-clamp-3">{task.description}</p>
        
        {task.status === "failed" && task.failedReason && (
          <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-[10px] text-red-400 font-black uppercase mb-1">Reason:</p>
            <p className="text-xs text-red-600 italic">"{task.failedReason}"</p>
          </div>
        )}
      </div>

      {/* Actions Section */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div key="buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
              
              {/* 👨‍💻 EMPLOYEE ACTIONS */}
              {role === "employee" && (
                <>
                  {task.status === "pending" && (
                    <>
                      <button onClick={() => onProcessAction({ taskId: task._id, action: "accept" })} className="flex-1 py-3 bg-black text-white rounded-xl font-bold text-xs">Accept</button>
                      <button onClick={() => { setActionType("reject"); setShowForm(true); }} className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-xs">Reject</button>
                    </>
                  )}
                  {task.status === "ongoing" && (
                    <button onClick={() => { setActionType("submit"); setShowForm(true); }} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                      <FaCloudUploadAlt /> Prepare Submission
                    </button>
                  )}
                  {/* Read Only States */}
                  {task.status === "completed" && (
                    <div className="w-full py-3 bg-gray-50 text-gray-400 rounded-xl font-bold text-xs text-center border border-gray-100 italic">
                      ⌛ Waiting for Review
                    </div>
                  )}
                  {task.status === "accepted" && (
                    <div className="w-full py-3 bg-green-50 text-green-600 rounded-xl font-bold text-xs text-center border border-green-100">
                      🎉 Reward Unlocked!
                    </div>
                  )}
                </>
              )}

              {/* 👑 MANAGER ACTIONS */}
              {role === "manager" && task.status === "completed" && (
                <>
                  <button onClick={() => onReview({ taskId: task._id, status: "accepted" })} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold text-xs">Approve</button>
                  <button onClick={() => { setActionType("review_fail"); setShowForm(true); }} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-xs">Reject Work</button>
                </>
              )}

              {/* Manager Read Only */}
              {role === "manager" && task.status === "accepted" && (
                 <div className="w-full py-3 bg-gray-50 text-gray-400 rounded-xl font-bold text-xs text-center border border-gray-100 italic">
                   ✅ Mission Accomplished
                 </div>
              )}

            </motion.div>
          ) : (
            /* 📝 DYNAMIC FORM (Yahan code missing tha, ab daal diya hai) */
            <motion.form key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onSubmit={handleFormSubmit} className="space-y-3">
              {actionType === "submit" ? (
                <>
                  <textarea name="message" placeholder="Work summary..." className="w-full p-3 bg-gray-50 border rounded-xl text-xs outline-none focus:border-blue-400 h-20" required />
                  <div className="flex flex-col gap-1">
                     <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Attachments</label>
                     <input type="file" name="attachments" multiple className="text-[10px] text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                  </div>
                </>
              ) : (
                <textarea name="reason" placeholder="Enter reason..." className="w-full p-3 bg-gray-50 border rounded-xl text-xs outline-none focus:border-red-400 h-20" required />
              )}
              
              <div className="flex gap-2">
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-black text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                  <FaSave /> {isSubmitting ? "Processing..." : "Confirm"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-xs">Cancel</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskActionCard;