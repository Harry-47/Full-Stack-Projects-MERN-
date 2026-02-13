import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import axiosApi from "./axiosInstance";

const logout = async () => {

    try {
        const response = await axiosApi.post('http://localhost:3000/api/v1/auth/logout');

        if (!response.status === 200) {
            toast.error("Error logging out");
            throw new Error('Logout failed on the server.');
        }

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem('profilePic');
        
        
        // Redirect to the login page after a successful logout
        toast.success("Logged out successfully");
        
        return redirect('/auth/login');
    } catch (error) {
        console.error('Logout error:', error);
        
        return redirect('/auth/login');
    }
};

export default logout;