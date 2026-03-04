import { useLoaderData, Link } from 'react-router-dom';
import { FaHeart, FaComment, FaUserPlus, FaUserCircle } from 'react-icons/fa';
import BottomNav from '../../../components/BottomNav';
import Header from '../../../components/Header'; 

const NotifsPage = () => {
    // 1. Data Loader se nikalo
    const data = useLoaderData();
    const SERVER_URL = 'http://localhost:3000';

    // Helper: Notification Type k hisaab se Icon
    const getIcon = (type) => {
        switch (type) {
            case 'like': return <FaHeart className="text-red-500 text-sm" />;
            case 'comment': return <FaComment className="text-blue-500 text-sm" />;
            case 'follow': return <FaUserPlus className="text-green-500 text-sm" />;
            case 'upload': return <FaUserPlus className="text-purple-500 text-sm" />;
            default: return null;
        }
    };

    // Helper: Notification Text
    const getText = (type) => {
        switch (type) {
            case 'like': return 'liked your post.';
            case 'comment': return 'commented on your post.';
            case 'follow': return 'started following you.';
            case 'upload': return 'uploaded a new post.';
            default: return 'interacted with you.';
        }
    };

    return (
        <div className="min-h-screen bg-white pb-20 poppins-regular">
            
            {/* Header */}
            <Header></Header>
            
            <div className="max-w-xl mx-auto">
                { data.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>No Notifications yet. Sleep tight! 😴</p>
                    </div>
                ) : (
                     data.map((notif) => (
                        <div 
                            key={notif._id} 
                            className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition duration-150"
                        >
                            {/* Left: User Info & Icon */}
                            <div className="flex items-center gap-3 flex-1">
                                <div className="relative">
                                    {/* Sender DP */}
                                    <Link to={`/profile/${notif.sender._id}`}>
                                        {notif.sender.profilePic ? (
                                            <img 
                                                src={`${SERVER_URL}${notif.sender.profilePic}`} 
                                                alt={notif.sender.username} 
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                            />
                                        ) : (
                                            <FaUserCircle className="w-10 h-10 text-gray-400" />
                                        )}
                                    </Link>

                                    {/* Small Icon Badge (Like/Comment/Follow) */}
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                                        {getIcon(notif.type)}
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="text-sm">
                                    <Link to={`/profile/${notif.sender._id}`} className="font-bold text-gray-900 hover:underline mr-1">
                                        {notif.sender.username || notif.sender.name}
                                    </Link>
                                    <span className="text-gray-600">{getText(notif.type)}</span>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {new Date(notif.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Post Thumbnail (Only for Likes/Comments) */}
                            {notif.post && (notif.type === 'like' || notif.type === 'comment') && (
                                <div className="w-10 h-10 ml-3 flex-shrink-0">
                                    {notif.post.mediaUrl.match(/\.(mp4|webm)$/) ? (
                                        <video src={`${SERVER_URL}${notif.post.mediaUrl}`} className="w-full h-full object-cover rounded-md" />
                                    ) : (
                                        <img src={`${SERVER_URL}${notif.post.mediaUrl}`} alt="Post" className="w-full h-full object-cover rounded-md" />
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            <BottomNav/>
        </div>
    );
};

export default NotifsPage;