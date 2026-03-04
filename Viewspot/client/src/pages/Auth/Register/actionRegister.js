import { redirect } from "react-router-dom";
import { toast } from "react-toastify"; 

const actionRegister = async ({ request }) => {
  const formData = await request.formData();

  const data = Object.fromEntries(formData);

  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (res.ok) {
    toast.success(res.message || "Registration successful! Please log in.");
    return redirect(`/auth/login`);
  } else {
    return { error: result.error || "Something went wrong" };
  }
};
export default actionRegister;
