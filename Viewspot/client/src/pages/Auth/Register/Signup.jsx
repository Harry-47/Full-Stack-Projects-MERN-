// src/pages/auth/Register.jsx
import { Form, useActionData, useNavigation, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { motion } from "framer-motion";
import Footer from "../../../components/Footer";
import logo from '../../../assets/logo.png';
import ContinueWithGoogle from "../../../components/ContinueWithGoogle";
import promo from '../../../assets/promo.mp4';

const Register = () => {
    const data = useActionData();
    const { state } = useNavigation();

    const ACCENT_COLOR = '#0077FF'; 

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
                        {/* Abstract wavy line animation */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className={`absolute inset-0 bg-gradient-to-r from-blue-600 via-transparent to-black opacity-30`} // Black and Blue gradient
                            style={{ clipPath: 'polygon(0 20%, 100% 80%, 100% 100%, 0 100%)' }}
                        />
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                            className="text-center relative z-10"
                        >
                            {/* Connection Oriented Tagline */}
                            <p className="text-lg text-white">Connection oriented service for the community.</p> 
                            <motion.img
                                src={logo}
                                alt="Aesthetic shoes"
                                className="rounded-2xl shadow-lg w-full h-105 object-cover brightness-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                            <video src={promo} autoPlay loop muted className="absolute -top-45 left-0 w-full h-200 object-cover opacity-30 -z-10">
                                
                            </video>
                        </motion.div>
                    </div>

                    {/* Right side: Register Form (REDESIGNED) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex-1 p-8 sm:p-12 flex flex-col justify-center"
                    >
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <img
                                src={logo}
                                alt="Brand Logo"
                                className="w-100 h-30 object-cover mb-8 -ml-4"
                            />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Create Your Account</h2>
                        <p className="text-md text-gray-500 mb-8 text-center">Join us and start your journey.</p>

                        <Form method="post" className="space-y-5">
                            {data?.error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2"
                                >
                                    <MdError className="text-xl" />
                                    <p className="text-sm font-medium">{data.error}</p>
                                </motion.div>
                            )}

                            {/* Full Name Input */}
                            <motion.div
                                className="relative group"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <FaUser className={`absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-[${ACCENT_COLOR}]`} />
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    className={`w-full p-3 pl-12 border border-gray-300 rounded-xl outline-none focus:border-[${ACCENT_COLOR}] transition-all duration-300`}
                                />
                            </motion.div>

                            {/* Email Input */}
                            <motion.div
                                className="relative group"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <FaEnvelope className={`absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-[${ACCENT_COLOR}]`} />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className={`w-full p-3 pl-12 border border-gray-300 rounded-xl outline-none focus:border-[${ACCENT_COLOR}] transition-all duration-300`}
                                />
                            </motion.div>

                            {/* Password Input */}
                            <motion.div
                                className="relative group"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <FaLock className={`absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-[${ACCENT_COLOR}]`} />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    className={`w-full p-3 pl-12 border border-gray-300 rounded-xl outline-none focus:border-[${ACCENT_COLOR}] transition-all duration-300`}
                                />
                            </motion.div>

                            {/* Confirm Password Input */}
                            <motion.div
                                className="relative group"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <FaLock className={`absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-[${ACCENT_COLOR}]`} />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    required
                                    className={`w-full p-3 pl-12 border border-gray-300 rounded-xl outline-none focus:border-[${ACCENT_COLOR}] transition-all duration-300`}
                                />
                            </motion.div>


                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="flex justify-between items-center pt-2"
                            >
                                <Link to={'/auth/login'} className="text-sm font-medium text-gray-500 hover:text-black">Already have an account?</Link>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <button
                                    type="submit"
                                    disabled={state === "submitting"}
                                    className="relative bg-black text-white w-full py-3 rounded-xl font-semibold shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-300"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {state === "submitting" ? "Registering..." : "Register"}
                                        <BsArrowRightCircleFill className="text-xl" />
                                    </span>
                                </button>
                            </motion.div>
                            
                            {/* Separator */}
                            <div className="flex items-center my-6">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="mx-4 text-gray-500 text-sm">or</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            {/* Continue with Google button */}
                            <ContinueWithGoogle />
                        </Form>
                    </motion.div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Register;