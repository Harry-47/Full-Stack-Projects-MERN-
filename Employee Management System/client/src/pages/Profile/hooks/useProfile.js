import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosApi from "../../../utils/axiosInstance";

const useProfile = () => {
  const queryClient = useQueryClient();

  // 1. Fetch current user data (Common route for both roles)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await axiosApi.get("/auth/me");
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  // 2. Update Profile Mutation
  const updateMutation = useMutation({
mutationFn: async ({ formData, role }) => {

  console.log(formData)
  const endpoint = role === "manager" ? "/manager/update-profile" : "/employee/update-profile";
  return await axiosApi.patch(endpoint, formData);
},
    onSuccess: (responseData) => {
       
      const updatedUser = responseData.data.data

      if (updatedUser) {
        localStorage.setItem("name", updatedUser.name);
        localStorage.setItem("profilePic", updatedUser.profilePic || "null");
      }
      queryClient.invalidateQueries(["userProfile"]);
      toast.success("Profile Updated! ");
      localStorage.setItem("profilePic", updatedUser.profilePic)
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || "Update failed!");
    }
  });

  return {
    user: data,
    isLoading,
    isError,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isLoading
  };
};

export default useProfile;