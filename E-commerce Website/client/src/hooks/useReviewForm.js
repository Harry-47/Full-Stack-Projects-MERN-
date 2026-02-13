import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const useReviewForm = (order, onSubmit) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (order) {
            setReviews(
                order.items.map(item => ({
                    productId: item.productId._id,
                    rating: 0,
                    review: '',
                }))
            );
        }
    }, [order]);

    const handleRatingChange = (productId, newRating) => {
        setReviews(prev => prev.map(r => r.productId === productId ? { ...r, rating: newRating } : r));
    };

    const handleReviewTextChange = (productId, newReview) => {
        setReviews(prev => prev.map(r => r.productId === productId ? { ...r, review: newReview } : r));
    };

    const submitReviews = (e) => {
        e.preventDefault();
        const allRatingsGiven = reviews.every(review => review.rating > 0);
        
        if (!allRatingsGiven) {
            toast.warn('Please give a rating to all products before submitting.');
            return;
        }
        onSubmit(reviews);
    };

    return { reviews, handleRatingChange, handleReviewTextChange, submitReviews };
};

export default useReviewForm;