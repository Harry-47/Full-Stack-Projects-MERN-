import axiosApi from "../../../../utils/axiosInstance";

const decideEndpoint = (id) => {
    let fetchFn;
    
  return fetchFn = {
    queryKey: ["employeeDashboard", id || "me"],
    queryFn: async () => {
      const endpoint = id
        ? `/employee/dashboard?employee=${id}`
        : `/employee/dashboard`;

      const { data } = await axiosApi.get(endpoint);
      return data.data;
    },
  };
};

export default decideEndpoint;
