import { useState } from "react";
import { Form, useActionData, useNavigation, Link, useSearchParams } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaPenNib } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../assets/logo.png";
import ContinueWithGithub from "../../../components/ContinueWithGithub";

const Register = () => {
  const msg = useActionData();
  const { state } = useNavigation();
  const [searchParams] = useSearchParams();

  // 1. Get OAuth data from URL params
  // Added 'email' here because Zod needs it
  const oauthRole = searchParams.get("role");
  const oauthName = searchParams.get("name");
  const oauthEmail = searchParams.get("email"); 
  const isLoggedIn = searchParams.get("isLoggedIn");
  const profilePic = searchParams.get("profilePic");

  // Check if all required OAuth params are present
  const isOAuthUser = oauthRole && oauthName && oauthEmail && isLoggedIn && profilePic;

  // State for role selection
  const [selectedRole, setSelectedRole] = useState("");

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
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-blue-600 via-transparent to-blue-600 opacity-20"
              style={{
                clipPath: "polygon(0 20%, 100% 80%, 100% 100%, 0 100%)",
              }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-white opacity-10"
              style={{ clipPath: "polygon(0 0%, 100% 20%, 100% 0%, 0 0%)" }}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="text-center relative z-10"
            >
              <h2 className="text-4xl font-bold mb-2">StaffGrid</h2>
              <p className="text-lg text-gray-400">
                Join the community. Elevate your style.
              </p>
              <motion.img
                src={logo}
                alt="Branding Logo"
                className="mt-8 rounded-2xl shadow-lg w-full h-[300px] object-cover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>
          </div>

          {/* Right side: Register Form */}
          <motion.div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
              {isOAuthUser ? "Complete Your Profile" : "Create Your Account"}
            </h2>
            <p className="text-lg text-gray-500 mb-8 text-center">
              {isOAuthUser
                ? "Just a few more details to get you started."
                : "Join the StaffGrid community."}
            </p>

            <Form method="post" className="space-y-4">
              {msg && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
                >
                  <MdError className="text-xl" />
                  <p className="text-sm font-medium">{msg}</p>
                </motion.div>
              )}

              {/* 2. Hidden Inputs for Zod Validation */}
              {isOAuthUser && (
                <>
                  <input type="hidden" name="isOAuth" value="true" />
                  {/* Dummy passwords to satisfy Zod validation */}
                  <input type="hidden" name="password" value="OAuthDummyPass123!" />
                  <input type="hidden" name="confirmPassword" value="OAuthDummyPass123!" />
                </>
              )}

              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    defaultValue={oauthName || ""}
                    readOnly={!!isOAuthUser}
                    placeholder="Full Name"
                    required
                    className={`w-full p-3 pl-12 border border-gray-300 rounded-4xl outline-none focus:border-black transition-all ${
                      isOAuthUser ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
                
                {/* Added Email Field Back - Zod needs this */}
                <div className="relative">
                  <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    defaultValue={oauthEmail || ""}
                    readOnly={!!isOAuthUser}
                    placeholder="Email"
                    required
                    className={`w-full p-3 pl-12 border border-gray-300 rounded-4xl outline-none focus:border-black transition-all ${
                      isOAuthUser ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Phone & Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FaPhone className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                  <input
                    name="number"
                    type="text"
                    placeholder="Phone Number"
                    required
                    className="w-full p-3 pl-12 border border-gray-300 rounded-4xl outline-none focus:border-black transition-all"
                  />
                </div>
                <div className="relative">
                  <select
                    name="role"
                    required
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-3 pl-4 border border-gray-300 rounded-4xl outline-none focus:border-black transition-all text-gray-600 cursor-pointer appearance-none"
                  >
                    <option value="">Select Role</option>
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>

              {/* Conditional Category Selection */}
              <AnimatePresence>
                {selectedRole === "employee" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative overflow-hidden"
                  >
                    <select
                      name="category"
                      required
                      className="w-full p-3 pl-4 border border-gray-300 rounded-4xl outline-none focus:border-black transition-all text-gray-600 cursor-pointer appearance-none"
                    >
                      <option value="">Select Category</option>
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Testing">Testing</option>
                      <option value="HR">HR</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password Fields - Show ONLY if NOT OAuth User */}
              {!isOAuthUser && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                    <input
                      name="password"
                      type="password"
                      placeholder="Password"
                      required
                      className="w-full p-3 pl-12 border border-gray-300 rounded-4xl outline-none focus:border-black transition-all"
                    />
                  </div>
                  <div className="relative">
                    <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      required
                      className="w-full p-3 pl-12 border border-gray-300 rounded-4xl outline-none focus:border-black transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Bio Section */}
              <div className="relative">
                <FaPenNib className="absolute top-4 left-4 text-gray-400" />
                <textarea
                  name="bio"
                  placeholder="Brief Bio (Skills, Dept...)"
                  required
                  className="w-full p-3 pl-12 border border-gray-300 rounded-2xl outline-none focus:border-black transition-all h-24 resize-none"
                />
              </div>

              {/* Navigation Links - Hide if OAuth User */}
              {!isOAuthUser && (
                <div className="flex justify-between items-center w-full px-2">
                  <Link
                    to="/auth/login"
                    className="text-sm font-medium hover:text-gray-600 text-gray-400"
                  >
                    Already have an account?
                  </Link>
                  <Link
                    to="/auth/forget-password"
                    className="text-sm font-medium hover:text-gray-600 text-gray-400"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}

              {/* Register Button */}
              <button
                type="submit"
                disabled={state === "submitting"}
                className="bg-black text-white w-full py-3 rounded-4xl font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
              >
                {state === "submitting"
                  ? "Processing..."
                  : isOAuthUser
                  ? "Complete Registration"
                  : "Register"}
                <BsArrowRightCircleFill className="text-xl" />
              </button>

              {/* OAuth Buttons - Hide if OAuth User */}
              {!isOAuthUser && (
                <>
                  <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  <ContinueWithGithub />
                </>
              )}
            </Form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;