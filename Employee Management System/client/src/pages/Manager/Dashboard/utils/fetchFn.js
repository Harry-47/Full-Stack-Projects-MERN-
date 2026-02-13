import axiosApi from "../../../../utils/axiosInstance";

const fetchFn =  {
    queryKey: ["managerStats"],
    queryFn: async () => {
  
  const {data} =  await axiosApi.get(`/manager/dashboard`)
  return data.data
},
staleTime: 1000 * 60 * 2, 
  retry: false,
  refetchOnWindowFocus: true,
}

export default fetchFn;