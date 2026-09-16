import { redirect } from "react-router-dom";
import { toast } from "react-toastify"; 
import axiosApi from "../../../utils/axiosInstance";

const actionRegister = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    
    const res = await axiosApi.post('auth/register', data);

    if (res.status === 201) {
      toast.success(res.data?.msg || "Registration successful! Please log in.");
      return redirect(`/auth/login`);
    }
  } catch (err) {
    const errorMessage = err.response?.data?.error || "Something went wrong";
    
    return { error: errorMessage };
  }
};

export default actionRegister;
