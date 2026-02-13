import axiosApi from '../../../../utils/axiosInstance';

 const placeOrder = async (orderPayload) => {
    const { data } = await axiosApi.post('/users/orders/place', orderPayload);
    return data;
};

export default placeOrder;