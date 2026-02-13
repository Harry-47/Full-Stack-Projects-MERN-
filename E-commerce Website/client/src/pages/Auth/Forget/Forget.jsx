// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Footer from '../../../components/Footer';
import forgotPasswordApi from './actionForget.js';
import logo from '../../../assets/logo.png'; // Logo import kar liya hai

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const data = await forgotPasswordApi(email);
            setMessage(data.message);
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
                    className="flex flex-col lg:flex-row bg-white rounded-4xl shadow-2xl w-full max-w-6xl overflow-hidden"
                >
                    {/* Left side: Animated branding and logo */}
                    <div className="relative hidden lg:flex flex-1 items-center justify-center p-10 bg-black text-white overflow-hidden">
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-blue-300 opacity-30"
                            style={{ clipPath: 'polygon(0 20%, 100% 80%, 100% 100%, 0 100%)' }}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: '-100%' }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-white opacity-20"
                            style={{ clipPath: 'polygon(0 0%, 100% 20%, 100% 0%, 0 0%)' }}
                        />

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                            className="text-center relative z-10"
                        >
                            <h2 className="text-4xl font-bold mb-2">Harryesthetics</h2>
                            <p className="text-lg text-gray-400">Your style, your brand, our aesthetics.</p>
                            <motion.img
                                src={logo}
                                alt="Brand Logo"
                                className="mt-8 rounded-2xl shadow-lg w-full h-[300px] object-contain"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </motion.div>
                    </div>

                    {/* Right side: Forgot Password Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex-1 p-8 sm:p-12 flex flex-col justify-center"
                    >
                        <div className="flex flex-col items-center gap-4 mb-8 lg:hidden">
                            <img
                                src={logo}
                                alt="Brand Logo"
                                className="w-24 h-24 object-cover mb-4"
                            />
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent text-center">
                                Harryesthetics
                            </h1>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Forgot Password</h2>
                        <p className="text-lg text-gray-500 mb-8 text-center">Enter your email to receive a password reset link.</p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-4xl focus:outline-none focus:ring-2 focus:ring-gray-800"
                                />
                            </motion.div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded-4xl cursor-pointer font-bold hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </motion.button>
                        </form>
                        {message && <p className="mt-4 text-center text-sm">{message}</p>}
                    </motion.div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPassword;