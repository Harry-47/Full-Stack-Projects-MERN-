import { queryClient } from "../../../../../utils/queryClient";
import fetchFn from "./fetchFn";

const loaderPendingReviews = async () => {
    await queryClient.ensureQueryData(fetchFn)
}
export default loaderPendingReviews;