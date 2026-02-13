import axiosApi from "../../../../utils/axiosInstance";

const verifyOrder = async (request, params) => {
  const url = new URL(request.url);
  const id = params.id;
  const isVerificationRequest = url.searchParams.get("verification") === "true";

  let verificationResult = { status: null, message: null, verifiedid: null };

  if (id && isVerificationRequest) {
    try {
      const { data } = await axiosApi.get(`/users/orders/verify/${id}`);
      verificationResult.status = data.status;
      verificationResult.message = data.message;
      verificationResult.verifiedid = data.order?._id;
    } catch (error) {
      console.error("Verification fetch error:", error);
      verificationResult.status = "error";
      verificationResult.message =
        error.response?.data?.message || "Failed to verify order.";
    }
  }

  return { verificationResult };
};
export default verifyOrder;
