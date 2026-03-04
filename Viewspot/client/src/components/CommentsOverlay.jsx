import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaHeart, FaPaperPlane, FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const CommentsOverlay = ({ postId, onClose }) => {
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [loading, setLoading] = useState(false);
    
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const SERVER_URL = 'http://localhost:3000'; 

    
    // 1. Comments Fetch Karna
    useEffect(() => {
        const fetchComments = async () => {
            if (!postId) return;
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/user/comments/${postId}`, {
                 credentials: 'include' });
                if (!response.ok) throw new Error('Failed to fetch comments');
                
                const data = await response.json();
                setComments(data.comments || []); // Assume backend returns { comments: [...] }
            } catch (error) {
                toast.error("Failed to load comments!");
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [postId]);

    // 2. Comment Submit Karna
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        // **Optimistic UI:** Show comment instantly (frontend lag is kam hoga)
        const tempComment = {
            _id: Date.now(),
            text: newCommentText.trim(),
            
            user: { _id: 'temp_id', username: 'You', profilePic: null }, 
            createdAt: new Date().toISOString()
        };
        setComments(prev => [tempComment, ...prev]); 
        setNewCommentText('');

        try {
            const response = await fetch(`${API_BASE_URL}/user/comments/${postId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentText: tempComment.text }),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Comment post failed.');
            
    
            
        } catch (error) {
            // Failure: Optimistic update ko revert kar do
            setComments(prev => prev.filter(c => c._id !== tempComment._id)); 
            toast.error("Comment post nahi hua. Try again.");
        }
    };

    

    return (
    <AnimatePresence>
        <motion.div /* Backdrop */ onClick={onClose} 
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-end poppins-regular"
        >
            {/* Modal Container */}
            <motion.div
                initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }} 
                onClick={(e) => e.stopPropagation()}
                // Styling Change: Consistent width, better separation
                className="relative bg-white rounded-t-xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col"
            >
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
                    <h3 className="font-bold text-lg text-gray-900">Comments</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-black transition"><FaTimes /></button>
                </div>

                {/* Comments List (Scrollable Area) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* ... Loading/Empty States (UNCHANGED) ... */}
                    
                    {comments.length > 0 && (
                        comments.map((comment) => (
                            <div key={comment._id} className="flex items-start gap-3">
                                {/* DP Rendering (CLEANED UP) */}
                                <Link to={`/profile/${comment.user._id}`} className="flex-shrink-0">
                                    {comment.user.profilePic ? (
                                        <img 
                                            className="w-8 h-8 object-cover rounded-full mt-0.5" // Smaller DP, more aesthetic
                                            src={`${SERVER_URL}${comment.user.profilePic}`} 
                                            alt={comment.user.name || comment.user.displayName}
                                        />
                                    ) : (
                                        <FaUserCircle className="w-8 h-8 text-gray-400 mt-0.5" /> // Fallback Icon
                                    )}
                                </Link>
                                
                                {/* Comment Body */}
                                <div className="flex-1">
                                    <p className="text-sm text-gray-800">
                                        <Link to={`/profile/${comment.user._id}`} className="font-bold hover:text-black mr-1">
                                            {comment.user.name || comment.user.displayName}
                                        </Link>
                                        {comment.text}
                                    </p>
                                    {/* Interaction Bar */}
                                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                        <span className="font-medium">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        <button className="hover:text-black transition">Like</button>
                                        <button className="hover:text-black transition">Reply</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input Field (Sticky Bottom - REDESIGNED) */}
                <form onSubmit={handleCommentSubmit} className="p-4 border-t border-gray-200 sticky bottom-0 bg-white flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        disabled={loading}
                        // Input Styling: Cleaner rounded edges, electric blue focus ring
                        className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0077FF] transition"
                    />
                    <motion.button 
                        type="submit" 
                        disabled={!newCommentText.trim() || loading}
                        whileTap={{ scale: 0.9 }}
                        // Button Styling: Electric Blue accent, clean font color
                        className={`p-3 rounded-full transition duration-200 
                            ${!newCommentText.trim() || loading 
                                ? 'bg-gray-400 text-white' 
                                : 'bg-[#0077FF] hover:bg-blue-600 text-white shadow-md'
                            }`}
                    >
                        <FaPaperPlane />
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    </AnimatePresence>
);
};

export default CommentsOverlay;