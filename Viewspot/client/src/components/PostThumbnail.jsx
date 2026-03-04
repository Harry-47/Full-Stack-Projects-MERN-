import { motion } from 'framer-motion';
import { FaHeart, FaVideo } from 'react-icons/fa';

const PostThumbnail = ({ post, onClick, SERVER_URL }) => {
    
    // Safety check for media URL
    const mediaSrc = `${SERVER_URL}${post.mediaUrl}`;

    return (
        <motion.div 
            key={post._id}
            layoutId={`post-${post._id}`}
            onClick={() => onClick(post)} // Click hone par parent ka handler chalega
            className="relative aspect-square cursor-pointer group overflow-hidden bg-gray-100"
        >
            {/* Media Rendering */}
            {post.mediaType === 'video' ? (
                // Video: Muted aur object-cover
                <video 
                    src={mediaSrc} 
                    className="w-full h-full object-cover" 
                    muted 
                />
            ) : (
                // Image: object-cover with zoom effect
                <img 
                    src={mediaSrc} 
                    alt={post.caption} 
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-110" 
                />
            )}
            
            {/* Video Icon (if video) */}
            {post.mediaType === 'video' && (
                 <FaVideo className="absolute top-1 right-1 text-white text-md opacity-80" />
            )}

            {/* Hover Overlay for Likes Count */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 gap-4">
                <span className="flex items-center gap-1 font-bold">
                    <FaHeart /> {post.likes?.length || 0}
                </span>
            </div>
        </motion.div>
    );
};

export default PostThumbnail;