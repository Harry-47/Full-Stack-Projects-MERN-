import useManagerEmployees from "./hooks/useManagerEmployees";
import RenderEmployees from "./components/RenderEmployees";
import HandleStates from "../../../components/HandleStates";

const AllEmployees = () => {
  
  const { employees, isLoading, isError, deleteEmployee } = useManagerEmployees();

  if (isLoading || isError) return <HandleStates isLoading={isLoading} isError={isError} />;

  return (
    <RenderEmployees 
      employees={employees}
      deleteEmployee={deleteEmployee}
    />
  );
};

export default AllEmployees;