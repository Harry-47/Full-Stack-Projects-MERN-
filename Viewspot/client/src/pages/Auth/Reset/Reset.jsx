// src/pages/ResetPassword.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Footer from '../../../components/Footer';
import resetPasswordApi from './actionReset';
import logo from '../../../assets/logo.png'; 
import promo from '../../../assets/promo.mp4';

const ResetPassword = () => {


    const ACCENT_COLOR = '#0077FF';

    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const data = await resetPasswordApi(token, password);
            setMessage(data.message);
            
            setTimeout(() => {
                navigate('/auth/login');
            }, 3000);
            
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

   return (
        <div className="flex flex-col min-h-screen bg-gray-100 poppins-regular">
            <div className="flex-1 flex justify-center items-center p-4 lg:p-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
                    className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden"
                >
                    {/* Left side: Animated branding and logo */}
                    <div className="relative hidden lg:flex flex-1 items-center justify-center p-10 bg-black/90 text-white overflow-hidden">
                         <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className={`absolute inset-0 bg-gradient-to-r from-blue-600 via-transparent to-black opacity-30`} 
                            style={{ clipPath: 'polygon(0 20%, 100% 80%, 100% 100%, 0 100%)' }}
                        />
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                            className="text-center relative z-10"
                        >
                            <p className="text-lg text-white">Connection oriented service for the community.</p>
                            <motion.img
                                src={logo}
                                alt="Brand Logo"
                                className="mt-8 rounded-2xl shadow-lg w-full h-[300px] object-cover brightness-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                            <video src={promo} autoPlay loop muted className="absolute -top-45 left-0 w-full h-200 object-cover opacity-30 -z-10"></video>
                        </motion.div>
                    </div>

                    {/* Right side: Reset Password Form (REDESIGNED) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex-1 p-8 sm:p-12 flex flex-col justify-center"
                    >
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <FaLock className="text-4xl text-gray-800 " />
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 text-center">Set New Password</h2>
                            <p className="text-md text-gray-500 text-center">Enter a new secure password for your Viewspot account.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* New Password */}
                            <motion.div
                                className="relative group"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">New Password</label>
                                <FaLock className={`absolute top-12 text-xl left-4 mt-2 -translate-y-1/2 text-gray-400 group-focus-within:text-[${ACCENT_COLOR}] transition-colors duration-200`} />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={`w-full p-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[${ACCENT_COLOR}] transition-all duration-300`}
                                />
                            </motion.div>
                            
                            {/* Confirm Password */}
                            <motion.div
                                className="relative group"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                                <FaLock className={`absolute top-12 text-xl left-4 mt-2 -translate-y-1/2 text-gray-400 group-focus-within:text-[${ACCENT_COLOR}] transition-colors duration-200`} />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className={`w-full p-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[${ACCENT_COLOR}] transition-all duration-300`}
                                />
                            </motion.div>
                            
                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded-xl font-bold shadow-md hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? 'Updating...' : <>Reset Password <FaCheckCircle className="text-lg" /></>}
                            </motion.button>
                        </form>
                        
                        {/* Message Area */}
                        {message && <p className="mt-4 text-center text-sm text-gray-700 font-medium">{message}</p>}
                    </motion.div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default ResetPassword;