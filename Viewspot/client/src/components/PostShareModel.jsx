import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Socket instance
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Note: PostShareModal ko ab sirf postId aur onClose chahiye
const PostShareModal = ({ postId, onClose, mediaUrl, caption }) => { 
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState({});
    const [loading, setLoading] = useState(true); // Sirf contacts loading
    const [isSending, setIsSending] = useState(false);

    // 1. Contacts Fetch Karna (Followers + Following)
    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            try {
                // Fetch contacts list
                const response = await fetch(`${API_BASE_URL}/user/share/contacts`, { 
                    credentials: 'include' 
                });
                
                if (!response.ok) throw new Error('Failed to fetch share contacts');
                
                const data = await response.json();
                setUsers(data.contacts || []); 
                
            } catch (error) {
                toast.error("Failed to load contacts for sharing.");
                onClose(); // Agar contacts load na hon toh modal band kar do
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, [onClose]);

    // 2. User Select/Deselect Logic (UNCHANGED)
    const toggleUserSelect = (userId) => {
        setSelectedUsers(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    // 3. Final Share Handler (Multiple POST Requests)
    const finalShareHandler = async () => {
        const recipients = Object.keys(selectedUsers).filter(id => selectedUsers[id]);
        if (recipients.length === 0) {
            toast.error("Select at least one recipient!");
            return;
        }

        setIsSending(true);
        let successCount = 0;
        
        // Share text ko simple rakhte hain, caption ki zaroorat nahi
        const text = `${caption ? caption : 'Check out this post!'}`; 

        for (const receiverId of recipients) {
            const requestBody = {
        receiverId: receiverId,
        postId: postId,
        text: text, // Caption ya default text
    };;  
            
            try {
                const response = await fetch(`${API_BASE_URL}/user/messages/sharePost`, {
                    method: 'POST',
                    body: JSON.stringify(requestBody), 
                    credentials: 'include'
                });

                if (!response.ok) throw new Error(`Share failed for ${receiverId}`);

                // Server se message object lo (jismein populated post details hongi)
                const messageData = await response.json(); 
                
                // Real-time update ke liye: Socket emit (Controller mein save hone ke baad)
                socket.emit("new_message", messageData); 
                
                successCount++;

            } catch (error) {
                console.error(`Failed to share with ${receiverId}`, error);
            }
        }
        
        setIsSending(false);
        toast.success(`Post shared successfully with ${successCount} user(s)!`);
        onClose(); 
    };

    const selectedCount = Object.keys(selectedUsers).filter(id => selectedUsers[id]).length;

    // Loading State for the whole modal
    if (loading) {
        return (
            <motion.div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
                <p className="text-white text-lg">Loading Contacts...</p>
            </motion.div>
        );
    }
    
    // 4. Render
    return (
        <motion.div /* Backdrop */ onClick={onClose} 
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-center p-4 poppins-regular"
        >
            {/* Modal Container */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} 
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[85vh] flex flex-col"
            >
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-xl">
                    <h3 className="font-bold text-lg text-gray-900">Share Post</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-black transition"><FaTimes /></button>
                </div>

                {/* 🚨 ENHANCED POST PREVIEW SNIPPET 🚨 */}
                <div className="flex flex-col items-center p-4 border-b bg-gray-50">
                    {/* Media Preview (w-10 h-10 size) */}
                    <img 
                        src={`http://localhost:3000${mediaUrl}`} 
                        alt="Post Preview" 
                        className="w-full h-50 object-cover rounded-4xl mr-3 flex-shrink-0 shadow-xl"
                    />
                    
                    {/* Caption */}
                    <div className="flex flex-col truncate mt-5">
                        
                        <span className="text-xs text-gray-600 truncate">
                            {caption ? caption.substring(0, 40) + '...' : 'No caption'}
                        </span>
                    </div>
                </div>

                {/* Users List (Scrollable Area) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {users.length === 0 ? (
                        <p className="text-center text-gray-500">No contacts to share with.</p>
                    ) : (
                        users.map(user => (
                            <div 
                                key={user._id} 
                                className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer rounded-lg transition"
                                onClick={() => toggleUserSelect(user._id)}
                            >
                                <div className="flex items-center">
                                    {/* User DP */}
                                    {user.profilePic ? (
                                        <img src={`http://localhost:3000${user.profilePic}`} alt={user.name} className="w-8 h-8 rounded-full mr-2 object-cover" />
                                    ) : (
                                        <FaUserCircle className="w-8 h-8 text-gray-400 mr-2" />
                                    )}
                                    {/* Name */}
                                    <span className="font-semibold text-gray-800">{user.name || user.displayName}</span>
                                </div>
                                {/* Checkmark */}
                                {selectedUsers[user._id] && <FaCheckCircle className="text-blue-600" />}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Button */}
                <div className="p-4 border-t">
                    <motion.button 
                        onClick={finalShareHandler} 
                        disabled={isSending || selectedCount === 0}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-2 rounded-lg transition duration-200 text-white font-bold ${
                            selectedCount > 0 && !isSending ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
                        }`}
                    >
                        {isSending ? 'Sending...' : `Share Post (${selectedCount})`}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PostShareModal;