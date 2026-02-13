import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import axiosApi from '../../../../utils/axiosInstance';

const actionUsersData = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");

  try {
    // Axios delete request requires the 'data' property for body content
    await axiosApi.delete('/admin/users/delete', { 
      data: {data:email} 
    });

    toast.success("User Deleted Successfully! ✅");
    window.location.refresh() 
  } catch (err) {
    const message = err.response?.data?.message || "Delete operation failed";
    toast.error(message);
    return { success: false, message };
  }
};

export default actionUsersData;