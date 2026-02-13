import useAssignTask from "./hooks/useAssignTask";
import RenderAssignTasks from "./components/RenderAssignTasks";
import HandleStates from "../../../../components/HandleStates";

const AssignTask = () => {
  const { 
    employees, 
    isLoading, 
    isError, 
    category, 
    setCategory, 
    assignTask,
    isSubmitting 
  } = useAssignTask();

  if (isLoading) return <HandleStates isLoading={true} />;
  if (isError) return <HandleStates isError={true} />;

  return (
    <RenderAssignTasks 
      employees={employees}
      category={category}
      setCategory={setCategory}
      assignTask={assignTask}
      isSubmitting={isSubmitting}
    />
  );
};

export default AssignTask;