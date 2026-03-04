import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

// Ye URL tumhari .env file se aana chahiye, filhal hardcode kar rahe hain
const API_BASE_URL = 'http://localhost:3000/api'; 

 const loaderDMs = async () => {
    
    try {
        // Backend se conversations ki list GET request se mangwao
        const response = await fetch(`${API_BASE_URL}/user/conversations`, {
            method: 'GET',
            credentials: 'include', 
        });

        if (response.status === 401) {
            toast.error('Please log in to view messages.');
            return redirect('/auth/login'); 
        }

        if (!response.ok) {
            throw new Error('Failed to fetch conversations from server.');
        }

        const data = await response.json();
    
        // { conversations: [{ members: [UserA, UserB], ... }], currentUserId: 'logged_in_id' }
        return data; 

    } catch (error) {
        console.error('DM Loader Error:', error);
        toast.error('Could not load messages. Server issue hai.');
        
        // Crash se bachane ke liye fallback empty array return karna zaroori hai
        return { conversations: [], currentUserId: null }; 
    }
};

export default loaderDMs;