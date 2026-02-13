import { queryClient } from "../../../../utils/queryClient";
import fetchFn from "./fetchFn";

const loadManagerDashboard = async () => {
  try {
    return await queryClient.ensureQueryData(fetchFn);
  } catch (error) {
    return null;
  }
}

export default loadManagerDashboard;