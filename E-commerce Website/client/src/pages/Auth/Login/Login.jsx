// src/pages/auth/Login.jsx
import { Form, useNavigation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { BsArrowRightCircleFill } from "react-icons/bs";
import Footer from '../../../components/Footer';
import logo from '../../../assets/logo.png';
import ContinueWithGoogle from "../../../components/ContinueWithGoogle";
import ContinueWithGithub from "../../../components/ContinueWithGithub";

const Login = () => {
    const { state } = useNavigation();

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
                        {/* Abstract wavy line animation */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-blue-600 via-transparent to-blue-600 opacity-20"
                            style={{ clipPath: 'polygon(0 20%, 100% 80%, 100% 100%, 0 100%)' }}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: '-100%' }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-white opacity-10"
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
                                alt="Aesthetic shoes"
                                className="mt-8 rounded-2xl shadow-lg w-full h-[300px] object-cover"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </motion.div>
                    </div>

                    {/* Right side: Login Form */}
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
                                className="w-24 h-24 object-contain mb-4"
                            />
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent text-center">
                                Harryesthetics
                            </h1>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Welcome Back!</h2>
                        <p className="text-lg text-gray-500 mb-8 text-center">Login to your account to continue.</p>

                        <Form method="post" className="space-y-6">
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className="w-full p-3 pl-12 border border-gray-300 rounded-4xl outline-none focus:border-black transition-all duration-300"
                                />
                            </motion.div>

                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    className="w-full p-3 pl-12 border border-gray-300 rounded-4xl outline-none focus:border-black transition-all duration-300"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex justify-between items-center"
                            >
                                <Link to={'/auth/forget-password'} className="text-sm font-medium hover:text-gray-600 text-gray-400">Forget password?</Link>
                                <Link to={'/auth/register'} className="text-sm font-medium hover:text-gray-600 text-gray-400">Don't have an account?</Link>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <button
                                    type="submit"
                                    disabled={state === "submitting"}
                                    className="relative overflow-hidden bg-black text-white w-full py-3 rounded-4xl font-semibold shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-300"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {state === "submitting" ? "Logging in..." : "Login"}
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
                            {/*Continue With Github button */}
                            <ContinueWithGithub />
                        </Form>
                    </motion.div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;