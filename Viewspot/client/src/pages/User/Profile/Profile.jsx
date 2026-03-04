import {  useState } from 'react';
import { useLoaderData, Link } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
import { FaComment, FaHeart, FaTimes, FaPaperPlane, FaUserPlus, FaUserMinus, FaEdit } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';

import BottomNav from '../../../components/BottomNav';
import EditProfileModal from '../../../components/EditProfileModel';
import CommentsOverlay from '../../../components/CommentsOverlay';

const UserProfile = () => {
    const { user, posts, isOwnProfile, loggedInUserId } = useLoaderData(); 

    


    const [commentTargetPost, setCommentTargetPost] = useState(null); 
    
    // --- STATES ---
    const [selectedPost, setSelectedPost] = useState(null); // Full screen post overlay
    const [isEditing, setIsEditing] = useState(false);

    const isPostLiked = selectedPost?.likes.some(id => id.toString() === loggedInUserId);
    const hasFollowed = user.followers.some((id)=> id.toString() === loggedInUserId)


    const SERVER_URL = `${import.meta.env.VITE_API_URL}`; 
    const serverBase = SERVER_URL.replace('/api', '')

    // Handle DP Delete
    const handleDeleteDP = async () => {
        if(!window.confirm("Remove profile picture?")) return;
        try {
            const data = await fetch(`${SERVER_URL}/user/removeDP`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!data.ok) throw new Error('Failed to remove');
            window.location.reload();
        } catch (error) {
            toast.error('Could not remove DP');
        }
    }

    const handleLike = async (post) => {
        try{
        const data = await fetch(`${SERVER_URL}/user/${post._id}/like`
            ,{
                credentials: 'include'
            }
        )

        const response = await data.json()
        if(!response.ok)
        {
            throw new Error(response.msg || 'Failed to like the post!')
        }

        
    }
    catch(error)
    {
        toast.error(error)
    }
}

const handleFollow = async () => {
    try {
        const data = await fetch(`${SERVER_URL}/user/${user._id}/follow`,
        {
            method: 'POST',
            credentials: 'include'
        })

        const response = await data.json()

        if(!response.ok)
          throw new Error(response.msg || 'Failed to follow')

    toast.success('Followed the user succesfully!')
        
    } catch (error) {
        toast.error(error)
    }
    window.location.reload()
}
    return (
        <div className="min-h-screen bg-white pb-20 poppins-regular">
            
            {/* --- HEADER SECTION --- */}
            <header className="max-w-2xl mx-auto pt-8 px-6">
                <div className="flex items-center gap-6 mb-6">
                    
                    {/* Profile Pic */}
                    <div className="flex-shrink-0 relative group">
                        {/* Delete Button (Only visible if own profile & has pic) */}
                        {isOwnProfile && user.profilePic && (
                            <button 
                                onClick={handleDeleteDP}
                                className='absolute -right-2 -top-2 z-10 text-white bg-red-500 rounded-full p-1.5 shadow-md hover:bg-red-600 transition transform hover:scale-110'
                                title="Remove Picture"
                            >
                                <MdDelete size={14} />
                            </button>
                        )}
                        
                        <div className="p-1 rounded-full border-2 border-gray-200">
                            <img 
                                src={user.profilePic ? `http://localhost:3000${user.profilePic}` : "https://via.placeholder.com/150"} 
                                 
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Stats & Bio */}
                    <div className="flex-grow">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.displayName || user.name}</h2>
                        
                        <div className="flex gap-4 md:gap-6 text-sm mb-3">
                            <div className="text-center"><span className="font-bold block text-lg">{posts.length}</span> Posts</div>
                            <div className="text-center"><span className="font-bold block text-lg">{user.followers?.length || 0}</span> Followers</div>
                            <div className="text-center"><span className="font-bold block text-lg">{user.following?.length || 0}</span> Following</div>
                        </div>

                        <p className="text-sm text-gray-600 leading-snug whitespace-pre-line">
                            {user.bio}
                        </p>
                    </div>
                </div>

                {/* --- ACTION BUTTONS --- */}
                <div className="flex gap-3 mb-8">
                    {isOwnProfile ? (
                        // OPEN EDIT MODAL
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex-1 bg-gray-100 text-black py-2 rounded-lg font-semibold text-sm border border-gray-300 hover:bg-gray-200 transition flex justify-center items-center gap-2"
                        >
                            <FaEdit /> Edit Profile
                        </button>
                    ) : (
                        <>
                            <div
                            className="flex-1 bg-black text-white py-2 rounded-lg font-semibold text-sm shadow-md hover:bg-gray-800 transition flex justify-center items-center gap-2"
                            onClick={()=> handleFollow()}>
                            
                            { !hasFollowed ? (
                            
                            <button  className='flex flex-row gap-1 cursor-pointer bg-transparent border-none text-white'>
                                <FaUserPlus className='mt-0.5'/> Follow
                            </button>
                            
                            )
                            :
                            (
                            <button  className='flex flex-row gap-1 cursor-pointer bg-transparent border-none text-white'>
                                <FaUserMinus className='mt-0.5'/> Unfollow
                            </button>
                            )
                             }
                            </div>
                            <Link
                            to={`/chat/${user._id}`}
                            className="flex-1 bg-gray-100 text-black py-2 rounded-lg font-semibold text-sm border border-gray-300 hover:bg-gray-200 transition flex justify-center items-center gap-2 cursor-pointer">
                            <button className='flex flex-row gap-1 cursor-pointer bg-transparent border-none text-black'>
                                <FaPaperPlane /> Message
                            </button>
                            </Link>
                        </>
                    )}
                </div>

                <div className="border-t border-gray-200 mb-1"></div>
            </header>

            {/* --- POSTS GRID --- */}
            <section className="max-w-2xl mx-auto">
                <div className="grid grid-cols-3 gap-1 md:gap-2">
                    {posts.map((post) => (
                        <motion.div 
                            key={post._id}
                            layoutId={`post-${post._id}`}
                            onClick={() => setSelectedPost(post)}
                            className="relative aspect-square cursor-pointer group overflow-hidden bg-gray-100"
                        >
                            {post.mediaType === 'video' ? (
                                <video src={`http://localhost:3000${post.mediaUrl}`} className="w-full h-full object-cover" muted />
                            ) : (
                                <img src={`http://localhost:3000${post.mediaUrl}`} alt="Post" className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                                    <video src={`http://localhost:3000${selectedPost.mediaUrl}`} controls autoPlay className="max-h-[60vh] w-full object-contain cursor-pointer" onClick={()=> window.open(`${serverBase}${selectedPost.mediaUrl}`)}/>
                                ) : (
                                    <img src={`http://localhost:3000${selectedPost.mediaUrl}`} alt="Full view" className="max-h-[60vh] w-full object-contain cursor-pointer" onClick={()=> window.open(`${serverBase}${selectedPost.mediaUrl}`)}/>
                                )}
                            </div>
                            <div className="p-5 bg-white">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex gap-4 text-xl text-gray-700">
                                        <FaHeart className={`${isPostLiked ? "text-red-500" : "hover:text-red-500 cursor-pointer"}`}
                                        onClick={()=> handleLike(selectedPost)}/>
                                        <FaComment className="hover:text-blue-500 cursor-pointer" onClick={()=> setCommentTargetPost(selectedPost)} />
                                        <FaPaperPlane className="hover:text-green-500 cursor-pointer" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{selectedPost.likes?.length || 0} Likes</span>
                                </div>
                                <p className="text-sm text-gray-800">
                                    <span className="font-bold mr-2">{user.username}</span>
                                    {selectedPost.caption}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- EDIT PROFILE OVERLAY --- */}
            <AnimatePresence>
                {isEditing && (
                    <EditProfileModal 
                        user={user} 
                        onClose={() => setIsEditing(false)} 
                    />
                )}
            </AnimatePresence>

            {/* 🚨 Comments Overlay 🚨 */}
            <AnimatePresence>
                {commentTargetPost && (
                    <CommentsOverlay 
                        postId={commentTargetPost._id} // Pass the ID
                        onClose={() => setCommentTargetPost(null)} 
                    />
                )}
            </AnimatePresence>

            <BottomNav
            currentUser={loggedInUserId}
              />
        </div>
    );
};

export default UserProfile;