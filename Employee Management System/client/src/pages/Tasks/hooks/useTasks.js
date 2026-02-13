import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosApi from "../../../utils/axiosInstance";

const useTasks = (statusFilter = "pending") => {
  const queryClient = useQueryClient();
  const role = localStorage.getItem("role")

  // 1. Fetching logic (Role wise endpoint)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks", statusFilter],
    queryFn: async () => {
      const endpoint = role === "manager" ? "/manager/tasks" : "/employee/tasks";
      const { data } = await axiosApi.get(`${endpoint}?status=${statusFilter}`);
      return data.data;
    },
  });

  // 2. Action for Employee (Accept/Reject Mission)
  const processActionMutation = useMutation({
    mutationFn: async ({ taskId, action, failedReason }) => {
      return await axiosApi.patch(`/employee/task/process/${taskId}`, { action, failedReason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Mission Status Updated! 🎯");
    },
  });

  // 3. Submission for Employee
  const submitMutation = useMutation({
    mutationFn: async ({ taskId, formData }) => {
      return await axiosApi.post(`/employee/task/submit/${taskId}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Mission submitted for review! 🚀");
    },
  });

  // 4. Review for Manager (Approve/Reject Work)
  const reviewMutation = useMutation({
    mutationFn: async ({ taskId, status, failedReason }) => {
      return await axiosApi.patch(`/manager/task/review/${taskId}`, { status, failedReason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Review complete! Score updated. ✅");
    },
  });

  return {
    tasks: data || [],
    isLoading,
    isError,
    processAction: processActionMutation.mutate,
    submitTask: submitMutation.mutate,
    reviewTask: reviewMutation.mutate,
    isSubmitting: submitMutation.isLoading || processActionMutation.isLoading || reviewMutation.isLoading
  };
};

export default useTasks;