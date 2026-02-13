import { useState, useEffect } from 'react';

const useUserProfileUI = (verificationResult) => {
    const [openOrderId, setOpenOrderId] = useState(null);
    const [displayStatus, setDisplayStatus] = useState({ 
        status: verificationResult?.status, 
        message: verificationResult?.message 
    });
    
    // Logic for verified order scrolling
    useEffect(() => {
        if (verificationResult?.verifiedid) {
            setOpenOrderId(verificationResult.verifiedid);
            setTimeout(() => {
                const verifiedElement = document.getElementById(`order-${verificationResult.verifiedid}`);
                if (verifiedElement) {
                    verifiedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        }
    }, [verificationResult]);

    const handleToggleDetails = (orderId) => {
        setOpenOrderId(openOrderId === orderId ? null : orderId);
    };

    return {
        openOrderId,
        displayStatus,
        handleToggleDetails,
        setDisplayStatus
    };
};

export default useUserProfileUI;