import axiosApi from "../../../utils/axiosInstance";

const resetPasswordApi = async (token, newPassword) => {
  let msg;

  const response = await axiosApi.post(
    `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
    { newPassword },
  );

  const { data } = response;

  if (!response.status === 200) {
    return data.msg || "Something went wrong while resetting the password.";
  }

  return (msg =
    data.msg || "Password reset successfully! Redirecting to login...");
};
export default resetPasswordApi;
