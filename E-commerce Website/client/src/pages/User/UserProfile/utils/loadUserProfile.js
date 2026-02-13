import fetchFn from "./fetchFn";
import verifyOrder from "./verifyOrder";
import { queryClient } from '../../../../main';
const loadUserProfile = async ({ request, params }) => {
    

    // 1. Prefetching the orders data
    await queryClient.prefetchQuery(fetchFn);

    // 2. Verification logic handling (as a side effect for the loader to return)
    //it will return a verificationResult object that will be used in the main page for showing UI for the order
    return verifyOrder(request, params)
};

export default loadUserProfile;