import { useState } from "react";
import useTasks from "./hooks/useTasks";
import RenderTasks from "./components/RenderTasks";
import HandleStates from "../../components/HandleStates";

const TasksPage = () => { 
  const [activeTab, setActiveTab] = useState("pending");

  
  const { 
    tasks, 
    isLoading, 
    isError, 
    processAction, 
    submitTask, 
    reviewTask, 
    isSubmitting 
  } = useTasks(activeTab);

  if (isLoading || isError) return <HandleStates isLoading={isLoading} isError={isError} />;

  return (
    <RenderTasks 
      tasks={tasks} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onProcessAction={processAction} 
      onSubmit={submitTask}
      onReview={reviewTask}
      isSubmitting={isSubmitting}
    />
  );
};

export default TasksPage;