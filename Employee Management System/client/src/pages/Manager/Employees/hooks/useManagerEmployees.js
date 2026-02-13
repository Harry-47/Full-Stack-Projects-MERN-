import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../../../utils/axiosInstance";
import { toast } from "react-toastify";
import fetchFn from "../utils/fetchFn";

const useManagerEmployees = () => {
  const queryClient = useQueryClient();

  const query = useQuery(fetchFn);

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!window.confirm("Are you sure?")) throw new Error("Cancelled");
      return await axiosApi.delete(`/manager/employee/${id}`);
    },
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries(["managerEmployees"]); 
    },
    onError: (err) => {
      if (err.message !== "Cancelled")
        toast.error(err.response?.data?.msg || "Failed");
    },
  });

  return {
    employees: query.data?.data || [], 
    isLoading: query.isLoading,
    isError: query.isError,
    deleteEmployee: deleteMutation.mutate, 
  };
};

export default useManagerEmployees;