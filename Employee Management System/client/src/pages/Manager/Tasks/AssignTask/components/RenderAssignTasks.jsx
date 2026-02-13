import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { FaUserPlus } from "react-icons/fa";
import FormInput from "../../../../../components/FormInput"; 
import DraggableEmployeeCard from "./DraggableEmployeeCard";
import DropZone from "./DropZone"; 
import Header from "../../../../../components/Header";

import { 
  CATEGORIES, 
  handleDragEndLogic, 
  handleSubmitLogic 
} from "../utils/assignTaskHelpers";

const RenderAssignTasks = ({ employees, category, setCategory, assignTask, isSubmitting }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <DndContext onDragEnd={(e) => handleDragEndLogic(e, setSelectedEmployee)}>
      <div className="min-h-screen bg-[#F5F5F7] p-6 lg:p-12 poppins-regular">
        <Header title="ASSIGN TASK" subtitle="Drag & Drop to assign missions"/>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
          
          {/* 📝 LEFT: Task Form */}
          <div className="lg:col-span-5">
            <DropZone selectedEmployee={selectedEmployee}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <FaUserPlus className="text-blue-600" /> Task Details
              </h3>
              
              <form onSubmit={(e) => handleSubmitLogic(e, selectedEmployee, category, assignTask)} encType="multipart/form-data">
                
                <div className="mb-4">
                  <label className="text-xs uppercase tracking-widest text-cyan-600 font-bold mb-1 block ml-1">
                    Selected Category
                  </label>
                  <div className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-bold text-sm">
                    {category}
                  </div>
                </div>

                <FormInput label="Title" name="title" placeholder="Fix UI Bugs..." required />
                <FormInput label="Deadline" name="date" type="date" required />
                <FormInput label="Description" name="description" isTextArea placeholder="Enter mission details..." required />
                <FormInput label='Assets' name='assets' type='file' placeholder='Upload Files' multiple />

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg mt-4"
                >
                  {isSubmitting ? "Deploying Mission..." : "Assign Task"}
                </button>
              </form>
            </DropZone>
          </div>

          {/* 👥 RIGHT: Employee Pool */}
          <div className="lg:col-span-7">
            <div className="flex gap-2 mb-6 flex-wrap">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setCategory(cat); setSelectedEmployee(null); }}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    category === cat ? "bg-blue-600 text-white" : "bg-white text-gray-500 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.length > 0 ? (
                employees.map(user => (
                  <DraggableEmployeeCard key={user._id} user={user} />
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-gray-400 italic">
                  No employee currently present in this category 🧊
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default RenderAssignTasks;