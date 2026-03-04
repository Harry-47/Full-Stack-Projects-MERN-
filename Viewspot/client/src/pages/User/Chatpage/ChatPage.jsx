import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { FaArrowLeft, FaPaperPlane, FaUserCircle, FaImage, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ENDPOINT = 'http://localhost:3000';
const SERVER_URL = 'http://localhost:3000';

// 🚨 Socket instance outside component to prevent re-connections
let socket;

const ChatPage = () => {
    const { receiverId } = useParams();
    const navigate = useNavigate();

    // --- STATES ---
    const [messages, setMessages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSharing, setIsSharing] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [conversation, setConversation] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // --- 1. SOCKET INITIALIZATION & SETUP ---
    useEffect(() => {
        if (!socket) {
            socket = io(ENDPOINT);
        }
        
        // Cleanup listener on unmount (but keep socket alive)
        return () => {
            if (socket) socket.off("message_received");
        };
    }, []);

    // --- 2. FETCH HISTORY & JOIN ROOM ---
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/user/messages/history/${receiverId}`, {
                    credentials: 'include'
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    setMessages(data.messages || []);
                    setConversation(data.conversation);
                    setCurrentUser(data.currentUserId);

                    // 🚨 SOCKET SETUP LOGIC 🚨
                    if (data.currentUserId) {
                        socket.emit("setup", data.currentUserId);
                    }
                    
                    // Agar conversation already hai, to room join kar lo
                    if (data.conversation && data.conversation._id) {
                        socket.emit("join_chat", data.conversation._id);
                    }
                }
            } catch (error) {
                toast.error("Error loading chat.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [receiverId]); // Run when receiver changes

    // --- 3. MESSAGE LISTENER (Separate useEffect) ---
    useEffect(() => {
        if (!socket) return;

        const handleMessageReceived = (newMessageRecieved) => {
            // Check if this message belongs to the current chat
            // Logic: Conversation ID matches OR Sender/Receiver IDs match
            const isCurrentChat = 
                (conversation && newMessageRecieved.conversationId === conversation._id) ||
                (newMessageRecieved.sender._id === receiverId) || 
                (newMessageRecieved.sender === receiverId);

            if (isCurrentChat) {
                setMessages((prev) => [...prev, newMessageRecieved]);
            }
        };

        socket.on("message_received", handleMessageReceived);

        return () => {
            socket.off("message_received", handleMessageReceived);
        };
    }, [conversation, receiverId]); // Re-bind if conversation updates


    // --- 4. SCROLL TO BOTTOM ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    // --- HANDLERS ---
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !selectedFile) return;

        const formData = new FormData();
        formData.append('receiverId', receiverId);
        // Agar conversation hai to bhejo, warna backend naya banayega
        if (conversation) formData.append('conversationId', conversation._id);
        
        if (newMessage.trim()) formData.append('text', newMessage.trim());
        if (selectedFile) formData.append('mediaFile', selectedFile);

        setIsSharing(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/messages/send`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Server rejected message.');
            
            const data = await response.json();

            // 🚨 CRITICAL FIX: AGAR PEHLA MESSAGE HAI TO ROOM JOIN KARO 🚨
            if (!conversation && data.conversationId) {
                const newConv = { _id: data.conversationId };
                setConversation(newConv); // State update
                socket.emit("join_chat", data.conversationId); // Socket join immediately
            }

            // UI Update
            setMessages(prev => [...prev, data]); 
            
            // Socket Emit
            socket.emit("new_message", data); 
            
            setNewMessage('');
            clearSelectedFile();

        } catch (error) {
            toast.error("Message send failed");
        } finally {
            setIsSharing(false);
        }
    };

    const clearSelectedFile = () => {
        setSelectedFile(null);
        setNewMessage('');
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const getReceiverInfo = () => {
        if (!conversation || !conversation.members) return { name: "User", profilePic: null };
        return conversation.members.find(m => m._id.toString() !== currentUser) || {};
    };
    const receiverInfo = getReceiverInfo();

    const renderMessageContent = (msg, isMyMessage) => {
        const isMedia = msg.mediaUrl && msg.mediaUrl.length > 0;
        const isVideo = isMedia && (msg.mediaUrl.endsWith('.mp4') || msg.mediaUrl.includes('video/'));
        const finalUrl = isMedia ? `${SERVER_URL}${msg.mediaUrl}` : '';

        return (
            <>
                {isMedia ? (
                    <div className="flex flex-col">
                        {isVideo ? (
                            <video controls src={finalUrl} className="rounded-md max-h-48 mb-1" />
                        ) : (
                            <img src={finalUrl} alt="media" className="rounded-md max-h-48 object-cover cursor-pointer" onClick={() => window.open(finalUrl)} />
                        )}
                        {msg.text && <p className={`mt-1 ${isMyMessage ? 'text-blue-100' : 'text-gray-800'}`}>{msg.text}</p>}
                    </div>
                ) : (
                    <p>{msg.text}</p>
                )}
                <span className={`text-[10px] block text-right mt-1 opacity-70 ${isMyMessage ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </>
        );
    };

    // --- RENDER ---
    return (
        <div className="flex flex-col h-screen bg-gray-50 poppins-regular">
            <header className="bg-white px-4 py-3 shadow-sm flex items-center sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="mr-4 text-gray-600 hover:text-black"><FaArrowLeft size={20} /></button>
                <Link to={`/profile/${receiverId}`} className="flex items-center gap-3">
                    <div className="relative">
                        {receiverInfo.profilePic ? 
                            <img src={`${SERVER_URL}${receiverInfo.profilePic}`} alt={receiverInfo.name} className="w-10 h-10 rounded-full object-cover" /> : 
                            <FaUserCircle className="w-10 h-10 text-gray-400" />
                        }
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 leading-none">{receiverInfo.name || 'User'}</h2>
                        <span className="text-xs text-green-500 font-medium">Online</span>
                    </div>
                </Link>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? <div className="text-center mt-10 text-gray-400">Loading...</div> : 
                 messages.length === 0 ? <div className="text-center mt-20 text-gray-500">Say Hi! 👋</div> :
                 messages.map((msg, index) => {
                    const isMyMessage = (msg.sender._id === currentUser) || (msg.sender === currentUser);
                    return (
                        <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm break-words ${isMyMessage ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                                {renderMessageContent(msg, isMyMessage)}
                            </div>
                        </div>
                    );
                 })
                }
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
                <input type="file" id="media-input" ref={fileInputRef} hidden onChange={(e) => { if(e.target.files[0]) { setSelectedFile(e.target.files[0]); } }} accept="image/*,video/*" />
                <label htmlFor="media-input" className={`p-2 cursor-pointer ${selectedFile ? 'text-blue-600' : 'text-gray-400'}`}><FaImage size={20} /></label>
                <input type="text" placeholder={selectedFile ? "File attached" : "Message..."} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-grow bg-gray-100 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                {selectedFile && <button type="button" onClick={clearSelectedFile} className="text-red-500 p-1"><FaTimes size={16} /></button>}
                <button type="submit" disabled={!newMessage.trim() && !selectedFile} className={`p-3 rounded-full ${!newMessage.trim() && !selectedFile ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white shadow-md'}`}><FaPaperPlane size={16} /></button>
            </form>
        </div>
    );
};

export default ChatPage;