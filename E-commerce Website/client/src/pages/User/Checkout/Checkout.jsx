import RenderCheckout from './components/RenderCheckout';
import useCheckout from './hooks/useCheckout';
import useCheckoutActions from './hooks/useCheckoutActions';

const Checkout = () => {
    // 1. Data Fetching
    const { isEmpty, cartItems } = useCheckout();
    const { mutate, isPending } = useCheckoutActions();

    // 2. Simple Handler
    const handleOrderSubmit = (customerDetails) => {
        mutate({ customerDetails, cartItems });
    };

    return (
        <RenderCheckout 
            onSubmit={handleOrderSubmit} 
            isSubmitting={isPending} 
            isEmpty={isEmpty} 
        />
    );
};

export default Checkout;