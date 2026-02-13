import { toast } from "react-toastify";
import axiosApi from "./axiosInstance";

const logout = async (navigate) => {
  try {
    const response = await axiosApi.post(
      `/auth/logout`,
    );

    if (!response.status === 200) {
      toast.error("Error logging out");
      throw new Error("Logout failed on the server.");
    }

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("name");
    localStorage.removeItem("profilePic")

    toast.success("Logged out successfully");
    return navigate("/auth/login");
  } catch (error) {
    console.error("Logout error:", error);

    return navigate("/auth/login");
  }
};

export default logout;
