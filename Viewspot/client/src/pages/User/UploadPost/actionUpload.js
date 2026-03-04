import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

 const actionUpload = async ({ request }) => {
    // 1. FormData Extract Karna (This is where the magic happens)
    const formData = await request.formData();
    
    // FormData se values nikalna
    const file = formData.get('media'); 
    const caption = formData.get('caption');
    const mediaType = formData.get('mediaType'); // Media type bhi aayega

    // Note: Hum yahan file ko access karne k liye 'media' use kar rahe hain, 
    // jo humne frontend Form mein 'name' attribute mein dena hai.

    if (!file || !file.size) {
        return { error: 'Media file is required.' };
    }

    try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; 

        const response = await fetch(`${API_BASE_URL}/user/createPost`, {
            method: 'POST',
            body: formData, // FormData ko seedha bhej do
            credentials: 'include',
        });
          
        const result = await response.json();
        if (response.ok) {
            // Yahan success ka message ya redirect return kar skte ho
            toast.success("Post uploaded successfully!");
            return redirect(`/user/:${result.id}`);
        } else {
            toast.error(result.error);
         
            return { error: result.error || "Upload failed." };
        }

    } catch (error) {
        console.error('Network Error:', error);
        return { error: "Could not connect to the server." };
    }
}
export default actionUpload;