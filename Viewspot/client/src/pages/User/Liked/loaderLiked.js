// src/loaders/loaderLiked.js (Fixed)
import { toast } from "react-toastify";

const loaderLiked = async ({params}) => {
    const id = params.id;
    try{
        // 1. Await fetch (RESPONSE object mil gaya)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${id}/liked`,
        {
            credentials: 'include'
        });

        // 2. Response Status check karo
        if(!response.ok)
        {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to load your liked reels');
        }

        // 3. Return JSON data
        const data = await response.json();
        return data; 
        
    }catch(error)
    {
        toast.error(`Loading Failed: ${error.message}`);
        // Agar error ho to empty object return karo taake component crash na ho
        return { likedReels: [] };
    }
}
export default loaderLiked;