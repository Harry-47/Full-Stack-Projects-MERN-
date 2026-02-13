import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosApi from '../../../utils/axiosInstance';

 const actionLogin = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const response = await axiosApi.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password } );

    

    if (response.status === 200) {
      // Login successful, show toast and then redirect
      toast.success('Login successful! Welcome back.');
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("name", response.data?.data.name)
      localStorage.setItem("role", response.data?.data.role)
      localStorage.setItem("profilePic", response.data?.data.profilePic)

      if (response.data?.data.role.toLowerCase() === 'manager') {
        return redirect('/manager/dashboard')
      } else if(response.data?.data.role.toLowerCase() === 'employee') {
        return redirect('/employee/dashboard')
      }
    } else {
 
      const msg = response.data.msg || 'Login failed. Please check your credentials.';
      return msg;
    }
  } catch (error) {
    // Network or server error
    toast.error('Could not connect to the server. Please try again.');
    return null;
  }
};
export default actionLogin;