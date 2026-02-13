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

      if (response.data?.user?.role?.toLowerCase() === 'admin') {
        return redirect('/admin/dashboard');
      } else {
        return redirect('/user/products');
      }
    } else {
      // Login failed, show error toast
      const message = response.data.msg || 'Login failed. Please check your credentials.';
      toast.error(message);
      
      return null;
    }
  } catch (error) {
    // Network or server error
    toast.error('Could not connect to the server. Please try again.');
    return null;
  }
};
export default actionLogin;