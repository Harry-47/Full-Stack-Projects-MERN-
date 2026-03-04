import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCamera, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditProfileModal = ({ user, onClose }) => {
    const [bio, setBio] = useState(user.bio || '');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user.profilePic ? `http://localhost:3000${user.profilePic}` : null);
    const [loading, setLoading] = useState(false);
    
    const fileInputRef = useRef(null);

    // Handle File Selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile)); // Instant Preview
        }
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('bio', bio);
            if (file) {
                formData.append('media', file);
            }

            // API Call
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/updateProfile`, {
                method: 'PUT', 
                body: formData,
                credentials: 'include'
            });

            if (response.ok) {
                toast.success("Profile Updated Successfully!");
                window.location.reload(); // Reload to show changes
            } else {
                const data = await response.json();
                toast.error(data.msg || "Update failed");
            }

        } catch (error) {
            console.error("Update Error:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10 poppins-regular"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black transition">
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Profile Pic Upload */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                            <div className="w-28 h-28 rounded-full border-4 border-gray-100 overflow-hidden shadow-sm">
                                <img 
                                    src={previewUrl || "https://via.placeholder.com/150"} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Overlay Icon */}
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                                <FaCamera className="text-white text-2xl" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Tap to change photo</p>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>

                    {/* Bio Input */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                        <textarea
                            rows="3"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition resize-none bg-gray-50"
                            placeholder="Tell the world about your aesthetics..."
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {loading ? "Saving..." : <><FaSave /> Save Changes</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default EditProfileModal;