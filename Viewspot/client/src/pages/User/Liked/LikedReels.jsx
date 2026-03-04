import { useState } from 'react';
import { useLoaderData, Form } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import { FaHeart, FaTimes, FaComment, FaPaperPlane } from 'react-icons/fa';
import BottomNav from '../../../components/BottomNav';
import CommentsOverlay from '../../../components/CommentsOverlay';
import Header from '../../../components/Header';

const LikedReels = ()=> {
    // Loader se data nikalte hain. Agar error ho to likedReels: [] aayega
    const { likedReels, loggedInUserId } = useLoaderData();

    const [selectedPost, setSelectedPost] = useState(null)
    const [commentTarget, setCommentTarget] = useState(null);
    const isPostLiked = selectedPost?.likes.some(id => id.toString() === loggedInUserId);
    
    // Safety check: Ensure likedReels is an array before mapping
    const posts = Array.isArray(likedReels) ? likedReels : [];
    const SERVER_URL = 'http://localhost:3000'; // Path fix k liye

    return (
<>

        <Header></Header>
        <section className="max-w-2xl mx-auto poppins-regular pt-16 pb-20 px-4">
            <div className="grid grid-cols-3 gap-1 md:gap-2">
                {/* Ab ye crash nahi karega kyunki posts guaranteed array hai */}
                {likedReels.map((post) => (
                    <motion.div 
                        key={post._id}
                        className="relative aspect-square cursor-pointer group overflow-hidden bg-gray-100"
                        onClick={() => setSelectedPost(post)}
                    >
                        {post.mediaType === 'video' ? (
                            <video src={`${SERVER_URL}${post.mediaUrl}`} className="w-full h-full object-cover" muted />
                        ) : (
                            <img src={`${SERVER_URL}${post.mediaUrl}`} alt="Post" className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 gap-4">
                            <span className="flex items-center gap-1 font-bold"><FaHeart /> {post.likes?.length || 0}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-10 text-gray-500"><p>No posts yet.</p></div>
            )}
        </section>

        {/* --- FULL SCREEN POST OVERLAY --- */}
        <AnimatePresence>
                {selectedPost && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 poppins-regular">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedPost(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div layoutId={`post-${selectedPost._id}`} className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
                            <button onClick={() => setSelectedPost(null)} className="absolute top-3 right-3 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black transition">
                                <FaTimes />
                            </button>
                            <div className="bg-black flex-grow flex items-center justify-center overflow-hidden">
                                {selectedPost.mediaType === 'video' ? (
                                    <video src={`http://localhost:3000${selectedPost.mediaUrl}`} controls autoPlay className="max-h-[60vh] w-full object-contain cursor-pointer" onClick={()=> window.open(`${SERVER_URL}${selectedPost.mediaUrl}`)} />
                                ) : (
                                    <img src={`http://localhost:3000${selectedPost.mediaUrl}`} alt="Full view" className="max-h-[60vh] w-full object-contain cursor-pointer" onClick={()=> window.open(`${SERVER_URL}${selectedPost.mediaUrl}`)} />
                                )}
                            </div>
                            <div className="p-5 bg-white">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex gap-4 text-xl text-gray-700">
                                        <FaHeart className={`${isPostLiked ? "text-red-500" : "hover:text-red-500 cursor-pointer"}`}
                                        onClick={()=> handleLike(selectedPost)}/>
                                        <FaComment className="hover:text-blue-500 cursor-pointer" onClick={() => setCommentTarget(selectedPost)}/>
                                        <FaPaperPlane className="hover:text-green-500 cursor-pointer" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{selectedPost.likes?.length || 0} Likes</span>
                                </div>
                                <p className="text-sm text-gray-800">
                                    {selectedPost.caption}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 🚨 Comments Overlay 🚨 */}
            <AnimatePresence>
                {commentTarget && (
                    <CommentsOverlay 
                        postId={commentTarget._id} // Pass the ID
                        onClose={() => setCommentTarget(null)} 
                    />
                )}
            </AnimatePresence>
            
        <BottomNav
        currentUser={loggedInUserId}
        />
        </>
    );
};
export default LikedReels;