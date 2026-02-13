import useManagerDashboard from "./hooks/useManagerDashboard";
import RenderManagerDashboard from "./components/RenderManagerDashboard";
import HandleStates from "../../../components/HandleStates"; 

const ManagerDashboard = () => {
  // 1. Getting data from custom hook
  const { data, isLoading, isError, status } = useManagerDashboard();
  // 2. Handling states
  if (isLoading || isError) {
    return <HandleStates isLoading={isLoading} isError={isError} status={status} />;
  }

  // 3. Data render component
  return <RenderManagerDashboard data={data} />;
};

export default ManagerDashboard;