import { FaSearch, FaSignOutAlt, FaShoppingCart, FaUserCircle, FaPhone} from 'react-icons/fa';
import { MdLogin } from "react-icons/md";
import { Link, Form } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ImCool } from "react-icons/im";
import useNavbar from '../hooks/useNavbar';

const Navbar = ({ page }) => {
    const { inputRef, loginState, profilePic, totalQuantity, handleSubmit } = useNavbar(page);
    

    return (
        <nav className={`w-full max-w-[100vw] flex items-center justify-between px-2 sm:px-4 py-3 shadow-md  poppins-regular 
       sticky top-0  z-50`}>
            
            
            
            {/* Left side: Brand, About, and Contact links */}
            <div className=" hidden md:flex items-center gap-1 md:gap-4 navbar-brand-links hover:animate-ping ">
                <div className="flex text-lg sm:text-xl md:text-2xl font-bold items-center gap-1 ">
                    <Link to={page === "admin" || page === "admin-order" || page === "admin-user" ? "/admin/dashboard" : "/user/about"} className="flex items-center gap-1">
                        <ImCool className={`text-lg sm:text-2xl md:text-3xlh-4 sm:h-5 md:h-10 w-3 sm:w-4 md:w-10 animate-spin duration-300`} />
                        <span className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-black via-gray-300 to-blue-500 bg-clip-text text-transparent animate-gradient-slow">
                            Harryesthetics
                        </span>
                    </Link>
                </div>
            </div>

            {/* The search bar */}
            {
                page !== "admin-order" && page!== "admin-user" && (
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center gap-1 p-0.5 sm:p-2 bg-gray-100 rounded-full w-full max-w-[45%] sm:max-w-[60%] md:max-w-lg mx-0.5 sm:mx-2 md:mx-4 relative group hover:scale-3d hover:scale-110 transition duration-200"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            name="search"
                            placeholder="Search Products..."
                            className="flex-1 p-0.5 sm:p-2 bg-gray-100 text-black outline-none rounded-full placeholder-gray-500 text-xs sm:text-sm transition-all duration-300 focus:w-full focus:bg-white"
                        />
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-0.5 sm:p-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors duration-200"
                        >
                            <FaSearch className="text-gray-700 text-xs sm:text-base" />
                        </motion.button>
                    </form>
                )
            }

            {/* Right side icons */}
            <motion.div className="flex items-center gap-0.5 sm:gap-1 md:gap-4 navbar-icons">
                {page === "admin" || page === "admin-order" || page==="admin-user"? (
                    <Form method="post" action="/auth/logout">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative p-3 w-16 sm:p-2 bg-black text-white rounded-full hover:bg-gray-800 overflow-hidden cursor-pointer group text-sm sm:text-lg md:text-2xl "
                        >
                            <span className="relative z-10"> <FaSignOutAlt className="inline-block" /></span>
                            <span className="absolute top-0 left-0 w-12 sm:w-10 h-full bg-white/20 -skew-x-12 transform -translate-x-full group-hover:translate-x-[120%] transition-all duration-700 ease-out"></span>
                        </motion.button>
                    </Form>
                ) : (
                    <>
                    <div className="hidden sm:flex items-center gap-4 text-sm md:text-base font-semibold">
                       
                        <Link to="/user/contact" className="relative">
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-1 sm:p-2 bg-black text-white rounded-full hover:bg-gray-800 overflow-hidden cursor-pointer group text-sm sm:text-lg md:text-2xl"
    >
        {/* Icon Container */}
        <span className="relative z-10">
            <FaPhone className="h-4 sm:h-5 md:h-10 w-3 sm:w-4 md:w-10" />
        </span>

        {/* Shine Effect Animation */}
        <span className="absolute top-0 left-0 w-8 sm:w-10 h-full bg-white/20 -skew-x-12 transform -translate-x-full group-hover:translate-x-[120%] transition-all duration-700 ease-out"></span>
    </motion.button>
</Link>
                    </div>
                {loginState ? (
                <>
                        <Link to="/user/cart" className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-1 sm:p-2 bg-black text-white rounded-full hover:bg-gray-800 overflow-hidden cursor-pointer group text-sm sm:text-lg md:text-2xl"
                            >
                                <span className="relative z-10"><FaShoppingCart className='h-4 sm:h-5 md:h-10 w-3 sm:w-4 md:w-10'/></span>
                                <span className="absolute top-0 left-0 w-8 sm:w-10 h-full bg-white/20 -skew-x-12 transform -translate-x-full group-hover:translate-x-[120%] transition-all duration-700 ease-out"></span>
                            </motion.button>
                            {totalQuantity > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs sm:text-xs font-bold rounded-full h-4 sm:h-5 md:h-10 w-3 sm:w-4 md:w-10 flex items-center justify-center"
                                >
                                    {totalQuantity}
                                </motion.span>
                            )} 
                        </Link>
                        </>
                        ): null
                }
                        {loginState ? (
                            <>
                                <Link to="/user/profile" className="relative">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative p-1 sm:p-2 bg-black text-white rounded-full hover:bg-gray-800 overflow-hidden cursor-pointer group text-sm sm:text-lg md:text-2xl"
                                    >
                                        <span className="relative z-10">{!profilePic? < FaUserCircle className='h-4 sm:h-5 md:h-10 w-3 sm:w-4 md:w-10 rounded-full'/>: <img 
                                        className='h-4 sm:h-5 md:h-10 w-3 sm:w-4 md:w-10 rounded-full object-cover scale-170'
                                        src={`${profilePic}`}/>}</span>
                                        <span className="absolute top-0 left-0 w-8 sm:w-10 h-full bg-white/20 -skew-x-12 transform -translate-x-full group-hover:translate-x-[120%] transition-all duration-700 ease-out"></span>
                                    </motion.button>
                                </Link>
                                <Form method="post" action="/auth/logout">
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative p-1 sm:p-2 bg-black text-white rounded-full hover:bg-gray-800 overflow-hidden cursor-pointer group text-sm sm:text-lg md:text-2xl"
                                    >
                                        <span className="relative z-10"><FaSignOutAlt className='h-4 sm:h-5 md:h-10 w-3 sm:w-4 md:w-10 ' /></span>
                                        <span className="absolute top-0 left-0 w-8 sm:w-10 h-full bg-white/20 -skew-x-12 transform -translate-x-full group-hover:translate-x-[120%] transition-all duration-700 ease-out"></span>
                                    </motion.button>
                                </Form>
                            </>
                        ) : (
                            <Link to="/auth/login">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative p-1 sm:p-2 bg-black text-white rounded-full hover:bg-gray-800 overflow-hidden cursor-pointer group poppins-bold text-sm sm:text-sm md:text-base"
                                >
                                    <span className="relative z-10"><p3 className='h-5 sm:h-6 md:h-10 w-5 sm:w-4 md:w-10 p-2'>Login</p3></span>
                                    <span className="absolute top-0 left-0 w-8 sm:w-10 h-full bg-white/20 -skew-x-12 transform -translate-x-full group-hover:translate-x-[120%] transition-all duration-700 ease-out"></span>
                                </motion.button>
                            </Link>
                        )}
                    </>
                )}
            </motion.div>
        </nav>
    );
};

export default Navbar;