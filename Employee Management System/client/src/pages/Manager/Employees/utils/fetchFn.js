import axiosApi from "../../../../utils/axiosInstance";

const fetchFn = {

    queryKey: () => ["managerEmployees"],
    queryFn: async () => {
        const res = await axiosApi.get("/manager/employees");
        return res.data;
    },
    retries: 1, 
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
}
export default fetchFn;