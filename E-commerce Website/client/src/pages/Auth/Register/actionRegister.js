import { redirect } from "react-router-dom";
import { toast } from "react-toastify"; 
import axiosApi from "../../../utils/axiosInstance";

const actionRegister = async ({ request }) => {
  const formData = await request.formData();

  const data = Object.fromEntries(formData);

  const res = await axiosApi.post(`${import.meta.env.VITE_API_URL}/auth/register`, data);

  

  if (res.status === 201) {
    toast.success(res.data?.msg || "Registration successful! Please log in.");
    return redirect(`/auth/login`);
  } else {
    return "Something went wrong" ;
  }
};
export default actionRegister;
