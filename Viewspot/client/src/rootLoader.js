 const rootLoader = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/check`, {
            credentials: 'include' 
        });

        if (response.ok) {
            const data = await response.json();
            return { loggedInUserId: data.userId };
        }
        return { loggedInUserId: null };

    } catch (error) {
        return { loggedInUserId: null };
    }
};
export default rootLoader;