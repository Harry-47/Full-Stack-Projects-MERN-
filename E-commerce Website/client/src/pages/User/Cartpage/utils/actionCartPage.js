import axiosApi from '../../../../utils/axiosInstance';

const actionCartPage = async ({ request }) => {
    // Extract product ID from form data
    const formData = await request.formData();
    const productId = formData.get('productId');

    // Execute deletion via POST request through axios instance
    await axiosApi.post(`/users/carts/remove/${productId}`);
    
    return null; 
}

export default actionCartPage;