import axiosApi from "../../../../../utils/axiosInstance";


const decideEndpoint = (category) => {
    let fetchFn;

    return fetchFn = {
    queryKey: ["employeesPool", category],
    queryFn: async () => {
      const { data } = await axiosApi.get(`/manager/employees?category=${category}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  }
}

export default decideEndpoint;