import { useDroppable } from "@dnd-kit/core";
import { FaUser } from "react-icons/fa";

const DropZone = ({ children, selectedEmployee }) => {
  const { setNodeRef, isOver } = useDroppable({ id: "form-drop-zone" });

  return (
    <div 
      ref={setNodeRef}
      className={`p-8 rounded-[2rem] border-2 transition-all duration-300 ${
        isOver ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-200 bg-white"
      }`}
    >
      {/* Selected Employee Preview Header */}
      <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
        {selectedEmployee ? (
          <div className="flex items-center gap-3 animate-pulse duration-75">
            
            {selectedEmployee.profilePic && selectedEmployee.profilePic !== "null" ? (
               // if picture exits, then show picture 
               <img 
                 src={selectedEmployee.profilePic} 
                 className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                 alt="Employee" 
               />
            ) : (
               // otherwise show react icon
               <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border border-gray-300">
                 <FaUser className="text-sm" />
               </div>
            )}

            <div>
                <p className="text-sm font-bold text-gray-900">{selectedEmployee.name}</p>
                <p className="text-[10px] text-blue-600 font-bold uppercase">Target Locked</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">Drag an employee card here to lock target</p>
        )}
      </div>
      
      {/* Form Children */}
      {children}
    </div>
  );
};

export default DropZone;