import axiosApi from "../../../../../utils/axiosInstance";
const fetchFn = {
    queryKey: ["tasks", "manager", "completed"], 
    queryFn: async () => {
      const { data } = await axiosApi.get("/manager/tasks?status=completed");
      return data.data;
    },
  }
  export default fetchFn;