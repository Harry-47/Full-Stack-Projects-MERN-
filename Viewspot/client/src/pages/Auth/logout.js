import { redirect } from "react-router-dom";
import { toast } from "react-toastify";

const logout = async () => {

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            toast.error("Error logging out");
            throw new Error('Logout failed on the server.');
        }
        
        
        // Redirect to the login page after a successful logout
        toast.success("Logged out successfully");
        
        return redirect('/auth/login');
    } catch (error) {
        toast.error('Logout error:', error);
        window.location.reload()
    }
};

export default logout;