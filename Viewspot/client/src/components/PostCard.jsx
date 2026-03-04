import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaShare, FaUserCircle } from 'react-icons/fa';
import { useState } from 'react';
import { toast } from 'react-toastify';

const PostCard = ({ post, index, currentUser, onCommentClick, onShareClick }) => { 

    const isLikedByMe = post.likes.some((id)=> id.toString()=== currentUser )

    const [isLiked, setisLiked] = useState(isLikedByMe)
    // Safety checks
    const ownerId = post.owner._id;
    const name = post.owner.name;
    const mediaType = post.mediaType;

    
    const handleLike = async () => {
        try{
        const data = await fetch(`${import.meta.env.VITE_API_URL}/user/${post._id}/like`
            ,{
                credentials: 'include'
            }
        )

        const response = await data.json()
        setisLiked(response.isLiked)
        
    }
    catch(error)
    {
        toast.error('Failed to like the post. ', error)
    }
    
}

    
    return (
        <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="bg-white/10 backdrop-blur-3xl rounded-xl shadow-2xl mb-8 overflow-hidden w-full poppins-regular text-black"
        >
            {/* --- TOP: Profile Header with ROUTING --- */}
            <Link to={`/profile/${ownerId}`} className="flex items-center p-4 hover:bg-gray-50 transition">
                {/* DP / Fallback Icon */}
                {post.owner.profilePic ? (
                    <img src={`http://localhost:3000${post.owner.profilePic}`} alt={name} className="w-10 h-10 rounded-full object-cover mr-3" />
                ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-400 mr-3" /> // Fallback icon
                )}
                {/* name Link */}
                <span className="font-semibold text-gray-800 hover:text-black transition duration-150">
                    {name || displayName}
                </span>
            </Link>

            {/* --- CENTER: Media Preview (Insta Style) --- */}
            <div className="w-full bg-black flex justify-center items-center">
                {mediaType === 'image' && (
                    <img src={`http://localhost:3000${post.mediaUrl}`} alt={post.caption} className="w-full object-contain max-h-[70vh] cursor-pointer" 
                    onClick={()=> window.open(`http://localhost:3000${post.mediaUrl}`)}/>
                )}
                {mediaType === 'video' && (
                    <video src={`http://localhost:3000${post.mediaUrl}`} controls className="w-full object-contain max-h-[70vh] cursor-pointer bg-black" 
                    onClick={()=> window.open(`http://localhost:3000${post.mediaUrl}`)}/>
                )}
            </div>

            {/* --- BOTTOM: Action Bar and Caption --- */}
            <div className="p-4">
                {/* Icons */}
                <div className="flex gap-4 text-xl mb-2">
                    {/* LIKE ICON: Functional onClick handler */}
                    <button onClick={handleLike} className={`${isLiked ? 'text-red-500' :'text-gray-300 hover:text-red-500' } transition duration-150 cursor-pointer`}>
                        <FaHeart /> 
                    </button>
                    
                    {/* COMMENT ICON */}
                    <span onClick={() => onCommentClick(post._id)} className="text-gray-500 hover:text-blue-500 transition duration-150 cursor-pointer">
                        <FaComment />
                    </span>

                    {/* SHARE ICON */}
                    <button onClick={()=> {
                        onShareClick(post._id, post.mediaUrl, post.caption)}} className="text-gray-300 hover:text-green-500 transition duration-150 cursor-pointer">
                        <FaShare />
                    </button>

                    <span className='ml-auto text-sm font-bold'>{post.likes.length} Likes</span>
                </div>

                {/* Caption Display */}
                <p className="text-sm ">
                    <span className="font-semibold mr-1">{name || displayName}</span> 
                    {post.caption}
                </p>
            </div>
        </motion.div>
    );
};

export default PostCard;