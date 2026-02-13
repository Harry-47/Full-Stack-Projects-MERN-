import { useSelector, useDispatch } from 'react-redux';
import { closeWishlist } from '../../../slices/uiSlice';

import useCartQuery from './hooks/useCartQuery';
import useCartActions from './hooks/useCartActions';

import RenderCart from './components/RenderCart';

const CartPage = () => {
    const dispatch = useDispatch();
    const isWishlistOpen = useSelector((state) => state.ui.isWishlistOpen);

    // 1. Fetch Data & Sync Logic
    const queryData = useCartQuery();

    // 2. Action Handlers
    const actions = useCartActions(queryData.cartItems);

    // 3. Render
    return (
        <RenderCart 
            {...queryData} 
            actions={actions}
            isWishlistOpen={isWishlistOpen}
            onCloseWishlist={() => dispatch(closeWishlist())}
        />
    );
};

export default CartPage;