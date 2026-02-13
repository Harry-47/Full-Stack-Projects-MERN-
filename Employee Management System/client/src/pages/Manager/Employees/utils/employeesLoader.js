import { queryClient } from "../../../../utils/queryClient";
import fetchFn from "./fetchFn";
const employeesLoader = async () => {

  try {
     await queryClient.ensureQueryData(fetchFn);
  } catch (error) {
    return null; 
  }
};

export default employeesLoader;