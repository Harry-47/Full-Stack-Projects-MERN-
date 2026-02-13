import { useQuery } from "@tanstack/react-query";
import decideEndpoint from "../utils/decideEndpoint"

const useEmployeeDashboard = (id) => {

  const fetchFn = decideEndpoint(id)
  const query = useQuery(fetchFn);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

export default useEmployeeDashboard;