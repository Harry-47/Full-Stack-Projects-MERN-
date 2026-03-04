import { useState } from 'react';
import { FaHome, FaSearch, FaPlus, FaHeart, FaUser } from 'react-icons/fa';
import UploadModal from '../components/UploadModel';
import { Link } from 'react-router-dom'; // Link Tag import karo

// Prop receive karo
const BottomNav = ({ currentUser }) => { 
    
    // Ye state modal ko on/off karegi
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Sirf icons dikhane k liye
    const icons = [
        { Icon: FaHome, label: 'Home', link: `/user/${currentUser}` },
        { Icon: FaSearch, label: 'Search', link: '/search' },
        { Icon: FaPlus, label: 'Upload', action: () => setIsModalOpen(true) }, 
        { Icon: FaHeart, label: 'Likes', link: `/user/${currentUser}/likes` },
        { Icon: FaUser, label: 'Profile', link: `/profile/${currentUser}` }, 
    ];

    return (
        <>
    {/* Modal code... */}
    {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} />} 

    {/* Fixed Bottom Bar (Redesigned Aesthetic) */}
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-2xl border-t border-gray-200 z-40 poppins-regular">
        <div className="flex justify-around items-center h-16 max-w-xl mx-auto">
            {icons.map((item, index) => (
                <div
                    key={index}
                    // Styling Change: Cleaner default look and enhanced upload effect
                    className={`p-3 cursor-pointer transition duration-200 
                        ${item.label === 'Upload' 
                            // Upload button ka special aesthetic: Black text, scale, aur chota sa shadow effect
                            ? 'text-black transform scale-125 bg-gray-50 rounded-full shadow-md' 
                            // Default icons: Light gray to black hover
                            : 'text-gray-500 hover:text-black'
                        }`}
                >
                    {/* Link/Action Logic (UNCHANGED) */}
                    {item.link ? (
                        <Link to={item.link} onClick={item.action} className="text-inherit"> {/* text-inherit se color upar wale div se aayega */}
                            <item.Icon className="text-xl mx-auto" />
                        </Link>
                    ) : (
                        <div onClick={item.action}>
                            <item.Icon className="text-xl mx-auto" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
</>
    );
};

export default BottomNav;