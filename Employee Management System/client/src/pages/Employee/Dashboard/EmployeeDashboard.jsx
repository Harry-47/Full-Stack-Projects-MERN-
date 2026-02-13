import useEmployeeDashboard from "./hooks/useEmployeeDashboard";
import RenderEmployeeDashboard from "./components/RenderEmployeeDashboard";
import HandleStates from "../../../components/HandleStates"; 
import { useParams } from "react-router-dom";

const EmployeeDashboard = () => {
  // 1. Data fetching via custom hook

  //the logic is that if there is some id present in the URL, the manager wants to see the employee dashobard so "none" the pointer events and display as static page 
  
  const {id} = useParams()
  const { data, isLoading, isError } = useEmployeeDashboard(id);

  // 2. Handling Loading and Error states
  if (isLoading || isError) {
    return <HandleStates isLoading={isLoading} isError={isError} />;
  }

  // 3. UI Render logic
  return <RenderEmployeeDashboard data={data} id={id}/>;
};

export default EmployeeDashboard;