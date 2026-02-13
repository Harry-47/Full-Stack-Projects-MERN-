import { queryClient } from '../../../../main';
import { fetchUsers } from "../utils/adminUserActions";

export const loadUsersData = async () => {
    try {
        await queryClient.prefetchQuery({
            queryKey: ['admin', 'users', ''], // Empty keyword for initial list
            queryFn: () => fetchUsers(),
        });
        return null;
    } catch (err) {
        throw new Response("Error loading users", { status: 500 });
    }
};

export default loadUsersData;