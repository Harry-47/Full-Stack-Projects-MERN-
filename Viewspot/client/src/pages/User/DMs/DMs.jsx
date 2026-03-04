import { useLoaderData, Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const DMs = () => {
    // Loader se conversations array aayegi: { conversations: [...] }
    const { conversations, currentUserId } = useLoaderData(); 

    return (
        <div className="min-h-screen bg-gray-50 poppins-regular">
            <header className="p-4 bg-white border-b sticky top-0">
                <h1 className="text-2xl font-bold text-gray-900">Direct Messages</h1>
            </header>
            
            <main className="max-w-xl mx-auto">
                {!conversations || conversations.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">Start a conversation 💭</p>
                ) : (
                    <div className="space-y-1">
                        {conversations.map((convo) => {
                            // Find the other user (jo logged-in user nahi hai)
                            const otherUser = convo.members.find(
                                member => member._id !== currentUserId // CurrentUserId loader se aayega
                            );

                            if (!otherUser) return null; // Safety check

                            return (
                                <Link 
                                    key={convo._id} 
                                    to={`/chat/${otherUser._id}`} // Chat page pe le jao
                                    className="flex items-center p-4 bg-white hover:bg-gray-100 transition duration-150 border-b"
                                >
                                    {/* DP */}
                                    {otherUser.profilePic ? (
                                        <img 
                                            src={`http://localhost:3000${otherUser.profilePic}`}
                                            alt={otherUser.name || otherUser.displayName || 'Follower'}
                                            className="w-12 h-12 rounded-full object-cover mr-4 flex-shrink-0"
                                        />
                                    ) : (
                                    <FaUserCircle className="w-12 h-12 text-gray-400 mr-4 flex-shrink-0" />)}
                                    
                                    {/* Name and Preview */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{otherUser.name || otherUser.displayName || 'Follower'}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-1">{convo.lastMessage || 'Start a conversation...'}</p>
                                    </div>

                                    {/* Time/Status (Optional) */}
                                    <p className="text-xs text-gray-400">{new Date(convo.updatedAt).toLocaleTimeString().slice(0,5)}</p>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default DMs;