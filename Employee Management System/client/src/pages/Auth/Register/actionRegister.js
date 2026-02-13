import { redirect } from "react-router-dom";
import { toast } from "react-toastify"; 
import axiosApi from '../../../utils/axiosInstance';

export const actionRegister = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    let msg;

    try {
        const res = await axiosApi.post(`/auth/register`, data);

        if (res?.status === 201 || res?.status === 200) {  //201 for manual registertaion, 200 when came from oauth and regsitered remaining details
            toast.success(res.data?.msg || "Registration successful!");
            return redirect(`/auth/login`);
        }
    } catch (err) {
        if (err.response?.data?.msg) {
            return err.response.data.msg;
        }
        
        if (err.response?.data?.errors) {
            return "Please check your credentials again!"
        }

        return msg = "Registration failed. Please check your details.";
    }
};

export default actionRegister;