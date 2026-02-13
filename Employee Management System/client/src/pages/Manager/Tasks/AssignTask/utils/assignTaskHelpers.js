import { toast } from "react-toastify";

// Constants
export const CATEGORIES = ['Development', 'Design', 'Marketing', 'Testing', 'HR'];

// Logic: will run upon drag end
export const handleDragEndLogic = (event, setSelectedEmployee) => {
  const { active, over } = event;
  // active.data.current is the data that we passed to the employee card
  if (over && over.id === "form-drop-zone") {
    setSelectedEmployee(active.data.current); 
  }
};

// Logic: will run upon form submission
export const handleSubmitLogic = (e, selectedEmployee, category, assignTask) => {
  e.preventDefault();
  
  if (!selectedEmployee) {
    return toast.warn("Drag an employee in the form to lock target!");
  }
  
  const formData = new FormData(e.target);
  
  // Append hidden values
  formData.append('assignedTo', selectedEmployee._id);
  formData.append('category', category); 
  
  assignTask(formData);
};