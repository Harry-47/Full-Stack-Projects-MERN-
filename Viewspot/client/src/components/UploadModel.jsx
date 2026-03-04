import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Form } from 'react-router-dom';
import { FaFileUpload, FaTimes, FaPaperPlane } from 'react-icons/fa';

const UploadModal = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    
    const mediaType = file ? file.type.split('/')[0] : null; 
    
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };



    // ---- RENDER SECTION ----
    return (
        // Ye poori screen pe overlay hai
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 poppins-regular">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90%] overflow-y-auto"
            >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-800">New Post</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <Form method="post" encType="multipart/form-data" >
                    <div className="p-6 space-y-4">
                        
                        {/* Hidden Input for mediaType - YAHI VALUE BHEJEGA */}
                        <input
                            type="hidden"
                            name="mediaType"
                            value={mediaType || ''} 
                        />

                        
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            accept="image/*,video/*"
                            name="media" // Multer yahi naam expect kr raha hai
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* File Selection / Preview */}
                        {!previewUrl ? (
                            <motion.div
                                onClick={() => fileInputRef.current.click()}
                                whileHover={{ scale: 1.02 }}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:bg-gray-50"
                            >
                                <FaFileUpload className="mx-auto text-4xl text-gray-500 mb-3" />
                                <p className="text-gray-600 font-medium">Click to select Image or Reel</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative rounded-xl overflow-hidden shadow-2xl p-1 border-2 border-transparent 
                                bg-gradient-to-br from-blue-400 to-indigo-500 transition duration-300"
                            >
                                <div className="bg-white rounded-lg p-3">
                                    {mediaType === 'image' && (
                                        <img src={previewUrl} alt="Post Preview" className="w-full max-h-96 object-contain rounded-lg" />
                                    )}
                                    {mediaType === 'video' && (
                                        <video src={previewUrl} controls className="w-full max-h-96 object-contain bg-black rounded-lg" />
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Caption and Post Button Row */}
                        {previewUrl && (
                            <div className="flex items-end gap-3 pt-2">
                                <textarea
                                    id="caption"
                                    value={caption} // Textarea controlled hai by state
                                    name="caption"
                                    onChange={(e) => setCaption(e.target.value)}
                                    rows="2"
                                    placeholder="Caption daal de..."
                                    className="flex-grow px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <motion.button
                                    type="submit"
                                    disabled={!file || loading} // Submit tab hi ho jab file ho
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-black text-white p-3 rounded-full shadow-lg disabled:opacity-50"
                                >
                                    <FaPaperPlane className="text-xl" />
                                </motion.button>
                            </div>
                        )}
                    </div>
                </Form>
            </motion.div>
        </div>
    );
};

export default UploadModal;