import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

export default function useNavbar(page){

    const location = useLocation();
    
    const searchParams = useSearchParams()[0]
    const navigate = useNavigate();
    const inputRef = useRef("");
    const [loginState, setLoginState] = useState(false);
    const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || null);
    const totalQuantity = useSelector((state) => state.cart.totalQuantity)

   useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" || searchParams.get('isLoggedIn') === "true";
        isLoggedIn && localStorage.setItem("isLoggedIn", "true");
        setLoginState(isLoggedIn);

        const profilePic = searchParams.get('profilePic') || localStorage.getItem('profilePic');
            profilePic && localStorage.setItem('profilePic', profilePic);
            setProfilePic(profilePic)
        


       
    }, [location, navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const searchTerm = inputRef.current.value.trim();

        if (searchTerm) {
            navigate(page === "admin" ? `/admin/products/search?keyword=${searchTerm}` : `/user/products/search?keyword=${searchTerm}`);
        } else {
            return; // Do nothing if the input is empty
        }
    };

return { inputRef, loginState, profilePic, totalQuantity, handleSubmit };}