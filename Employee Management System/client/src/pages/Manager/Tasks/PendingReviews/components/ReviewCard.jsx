import { FaCheck, FaTimes, FaDownload, FaCommentDots } from "react-icons/fa";

const ReviewCard = ({ task, updateStatus }) => {
  
  const handleAction = (status) => {
    let reason = null;
    if (status === 'failed') {
      reason = prompt("Why are you failing this task? (Reason required)");
      if (!reason) return;
    }
    updateStatus({ taskId: task._id, status, failedReason: reason });
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
        <span className="text-[10px] font-black bg-purple-50 text-purple-600 px-3 py-1 rounded-full uppercase">
          Review Needed
        </span>
      </div>

      {/* Submission Details */}
      <div className="bg-gray-50 p-5 rounded-2xl mb-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-xs uppercase">
          <FaCommentDots /> Employee Message:
        </div>
        <p className="text-sm text-gray-600 italic">"{task.submission?.message || 'No message provided'}"</p>
      </div>

      {/* Attachments */}
      {task.submission?.attachments?.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">Attachments</p>
          <div className="flex flex-wrap gap-2">
            {task.submission.attachments.map((file, i) => (
              <a 
                key={i} 
                href={`${import.meta.env.VITE_API_URL}/${file.path}`} 
                target="_blank" 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium hover:bg-gray-50 transition-all"
              >
                <FaDownload className="text-gray-400" /> {file.originalName}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-gray-50">
        <button 
          onClick={() => handleAction('accepted')}
          className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200"
        >
          <FaCheck /> Accept Mission
        </button>
        <button 
          onClick={() => handleAction('failed')}
          className="flex-1 py-4 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
        >
          <FaTimes /> Fail/Reject
        </button>
      </div>
      
      <div className="mt-6 flex items-center gap-3">
        <img src={task.assignedTo?.profilePic?.url} className="w-10 h-10 rounded-full border border-gray-200" alt="emp" />
        <div>
            <p className="text-xs font-bold text-gray-900">{task.assignedTo?.name}</p>
            <p className="text-[10px] text-gray-400">Submitted on: {new Date(task.submission?.submittedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;