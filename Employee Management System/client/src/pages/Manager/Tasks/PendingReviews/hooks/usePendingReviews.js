import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosApi from "../../../../../utils/axiosInstance";
import fetchFn from "../utils/fetchFn";

const usePendingReviews = () => {
  const queryClient = useQueryClient();

  const query = useQuery(fetchFn);

  const reviewMutation = useMutation({
    mutationFn: async ({ taskId, status, failedReason }) => {
      return await axiosApi.patch(`/manager/task/review/${taskId}`, { status, failedReason });
    },
    onSuccess: () => {
      toast.success(`Action processed! 🚀`);
      // 🧠 Invalidate everything related to tasks and dashboard
      queryClient.invalidateQueries(["tasks"]); 
      queryClient.invalidateQueries(["managerStats"]);
    },
    onError: () => toast.error("Review update fail ho gaya!"),
  });

  return {
    tasks: query.data || [],
    isLoading: query.isLoading,
    updateStatus: reviewMutation.mutate,
    isUpdating: reviewMutation.isLoading
  };
};;

export default usePendingReviews;