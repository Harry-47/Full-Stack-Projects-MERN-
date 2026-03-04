import { toast } from "react-toastify";

const loaderNotifications = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/notifications`, {
            method: 'GET',
            credentials: 'include' // JWT bhejna zaroori hai
        });

        if (!response.ok) {
            // Agar 401 (Unauthorized) aaye to null return kar skte hain ya error throw kar skte hain
            const errorData = await response.json();
            throw new Error(errorData.msg || "Failed to load notifications");
        }

        const data = await response.json();
        return data; // Ye seedha Array of notifications hoga

    } catch (error) {
        console.error("Loader Error:", error);
        toast.error("Could not load notifications.");
        return []; // Crash se bachne k liye empty array
    }
};
export default loaderNotifications;