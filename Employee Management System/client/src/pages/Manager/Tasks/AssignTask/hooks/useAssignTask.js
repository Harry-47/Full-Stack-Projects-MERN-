import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosApi from "../../../../../utils/axiosInstance";
import decideEndpoint from "../utils/decideEndpoint";

const useAssignTask = () => {
  const [category, setCategory] = useState("Development");
  const queryClient = useQueryClient();

  // 1. Fetch Employees based on Category
  const fetchFn = decideEndpoint(category)
  const query = useQuery(fetchFn);

  // 2. Assign Task Mutation
  const assignMutation = useMutation({
    mutationFn: async (taskData) => {
      return await axiosApi.post("/manager/assign-task", taskData);
    },
    onSuccess: () => {
      toast.success("Mission Deployed! 🚀");
      queryClient.invalidateQueries(["managerStats"]); //update admin dashboard
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || "Deployment failed!");
    }
  });

  return {
    employees: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    category,
    setCategory,
    assignTask: assignMutation.mutate,
    isSubmitting: assignMutation.isLoading
  };
};

export default useAssignTask;