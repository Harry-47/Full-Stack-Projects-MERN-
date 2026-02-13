import { useNavigation } from 'react-router-dom';

const useCheckout = () => {
    const navigation = useNavigation();
    
    // Access local storage (Safe check)
    const cartData = JSON.parse(localStorage.getItem('cart') || '{"items": []}');
    const cartItems = cartData?.items || [];
    
    // UI States
    const isSubmitting = navigation.state === 'submitting';
    const isEmpty = cartItems.length === 0;

    return {
        cartItems,
        isSubmitting,
        isEmpty
    };
};

export default useCheckout;