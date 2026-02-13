import axiosApi from '../../../../utils/axiosInstance';

const addReview = async ({ reviews, orderId }) => {
    const { data } = await axiosApi.post(`/users/products/add-review`, { reviews, orderId });
    return data;
};

export default addReview;