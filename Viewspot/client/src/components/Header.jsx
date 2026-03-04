import { Form, Link } from "react-router-dom"; 
import { MdLogout, MdOutlineMessage , MdNotifications } from 'react-icons/md'; // New icon for DMs
import logo from "../assets/logo.png"

const Header = () => {
  return (
    <div>
        <header className="py-4 px-6 bg-white/10 backdrop-blur-3xl shadow-sm sticky top-0 z-20 flex justify-between poppins-regular italic font-extrabold">
                <img src={logo} className="h-12 w-60 object-cover brightness-200"/>                
                <div className="flex items-center gap-4"> {/* Container for icons */}

                    <Link to="/notifications" className='bg-black text-2xl font-bold text-white p-2 rounded-3xl cursor-pointer hover:bg-gray-700 hover:scale-110  transition duration-100'>
                        <MdNotifications /> 
                    </Link>
                    
                    {/* DM Icon */}
                    <Link to="/dms" className='bg-black text-2xl font-bold text-white p-2 rounded-3xl cursor-pointer hover:bg-gray-700 hover:scale-110 transition duration-100'>
                        <MdOutlineMessage /> 
                    </Link>


                    {/* Logout Button */}
                    <Form method='POST' action='/auth/logout'>
                        <button type='submit' className='bg-black text-2xl font-bold text-white p-2 rounded-3xl cursor-pointer hover:bg-gray-700 hover:scale-110 transition duration-100'><MdLogout/></button>
                    </Form>
                </div>
            </header>
    </div>
  )
}

export default Header;