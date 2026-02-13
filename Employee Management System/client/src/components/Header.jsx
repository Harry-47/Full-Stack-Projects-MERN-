import { motion } from "framer-motion";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logout from "../utils/logout";


const Header = ({ title, subtitle, status = "ONLINE"  ,id, name}) => {
  const navigate = useNavigate();
  const userName = name ? name : localStorage.getItem("name")   //manager while viewing the stats will pass the name of particular employee as prop so its necesary otherwise logged in employee will get its name from localStorage

  //loggedIn user(manager/employee) will be shown its name on the right side of header where profile picture is shown, and when manager is viewing this dashobard for particular employee stats, the title will become the name of employee which will be passed by the manager page

  const role = localStorage.getItem("role")
  const userPic = localStorage.getItem("profilePic")



  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between items-start justify-center mb-8 poppins-regular w-full">
      {/* Left: Title & Subtitle */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        {/*the title here is actually the name of employee passed by the manager*/ }
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
          {title}<span className="text-blue-600">.</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1 tracking-wide font-medium uppercase">{subtitle}</p>
      </motion.div>
      
      {/* Right: User Profile & Logout */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`flex items-center gap-4 px-4 py-2 rounded-full shadow-sm ${id? "hidden" : null}`}
      >
         {/* Status Dot */}
         <div className="flex items-center">
          <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse mr-2" title={status}></span>

         {/* Profile Info */}
         {/*this userName is the name of user currently logged in , can be manager or employee*/}
         <div className="text-left sm:block">
          
            <p className="text-sm font-bold text-gray-900 leading-none">{userName}</p>
            <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Active</p>
         </div>

         {/* Profile Pic (Fallback to Icon) */}
         <Link className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center ml-2 hover:bg-blue-400 cursor-pointer transition-colors duration-200 " to={`${role === 'manager' ? '/manager/profile' : '/employee/profile'}`}> 
            {userPic != "null" ? (
                <img src={`${import.meta.env.VITE_API_URL}/${userPic}`}  alt=""className="w-full h-full object-cover" />
            ) : (
                <FaUserCircle className="text-gray-400 text-2xl" />
            )}
         </Link>
         </div>

         {/* Logout Button */}
         <button 
            onClick={()=> logout(navigate)} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-500 transition-colors duration-200 cursor-pointer"
            title="Logout"
         >
            <FaSignOutAlt />
         </button>
      </motion.div>
    </div>
  );
};

export default Header;