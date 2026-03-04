import { redirect } from "react-router-dom";

 const loaderFeed = async () => {
    try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        
        const response = await fetch(`${API_BASE_URL}/user/posts/feed?page=1`, {
            credentials: 'include' // JWT token cookie bhejte hain
        });
        const data = await response.json();

        if(response.status === 401 || response.status === 403)
            return redirect('/auth/login')
        
        if (!response.ok) {
            throw new Error(`Failed to fetch feed: ${response.statusText}`);
        }
        
        
        return data; // Data object mein return karo
        
    } catch (error) {
        console.error("Feed Loader Error:", error.message);
        return { posts: [], nextPage: undefined, currentUser: null, totalResults: 0 }; 
    }
};

export default loaderFeed;