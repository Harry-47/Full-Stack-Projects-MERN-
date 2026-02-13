import { useQuery } from "@tanstack/react-query";
import fetchFn from "../utils/fetchFn.js";

const useManagerDashboard = () => {
  const query = useQuery(fetchFn);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    status: query.status
  };
};

export default useManagerDashboard;