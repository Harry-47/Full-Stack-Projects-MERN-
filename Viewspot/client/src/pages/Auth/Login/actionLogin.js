import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast here

 const actionLogin = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include', 
    });

    const result = await response.json();

    if (response.ok) {
      // Login successful, show toast and then redirect
      toast.success('Login successful! Welcome back.');

      return redirect(`/user/:id}`); // Redirect to feed page
    } else {
      // Login failed, show error toast
      const message = result.error || 'Login failed. Please check your credentials.';
      toast.error(message);
    }
  } catch (error) {
    // Network or server error
    toast.error('Could not connect to the server. Please try again.');
    return null;
  }
};
export default actionLogin;