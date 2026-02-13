import { motion } from 'framer-motion';
import { MdDelete, MdLocationOn, MdPhone, MdPerson, MdAttachMoney } from "react-icons/md";
import { FaBox, FaSyncAlt } from "react-icons/fa";
import { BsArrowRightCircleFill } from "react-icons/bs";
import useAdminCard from '../hooks/useAdminCard';


const OrderCardAdmin = ({ orderId, items, totalPrice, status, name, address, phone, isVerified }) => {
    const { 
        selectedStatus, handleStatusChange, handleSaveStatus, handleDelete, getStatusColor, isSaving 
    } = useAdminCard(orderId, status);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="p-6 bg-white text-gray-800 rounded-4xl shadow-lg flex flex-col gap-4 border border-gray-200 hover:border-gray-400 hover:scale-105 transition-all duration-300 poppins-regular relative"
        >
            {isVerified && (
                <div className="absolute top-5 -left-3 bg-green-500 text-white text-xs font-bold py-1 px-4 rounded-4xl transform -rotate-45 origin-bottom-left">
                    Verified
                </div>
            )}
            
            <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Order ID: {orderId.substring(0, 8)}...</h3>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <MdDelete className="text-red-500 cursor-pointer hover:text-red-700 text-3xl" onClick={handleDelete} />
                </motion.div>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-sm flex items-center gap-2 text-gray-600 font-semibold"><MdPerson className="text-xl" /> Name: <span className="font-normal">{name}</span></p>
                <p className="text-sm flex items-center gap-2 text-gray-600 font-semibold"><MdPhone className="text-xl" /> Phone: <span className="font-normal">{phone}</span></p>
                <p className="text-sm flex items-center gap-2 text-gray-600 font-semibold"><MdLocationOn className="text-xl" /> Address: <span className="font-normal">{address.substring(0,25)}...</span></p>
            </div>

            <div className="py-4 border-t border-b border-gray-200 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <MdAttachMoney className="text-green-500 text-2xl" />
                    <p className="text-xl font-bold text-green-500">Total Price: {totalPrice.toFixed(2)} $</p>
                </div>
                <h3 className="text-base font-semibold flex items-center gap-2 text-gray-700 mt-2"><FaBox /> Items:</h3>
                <ul className="text-sm max-h-24 overflow-y-auto pl-4 list-disc text-gray-600">
                    {items.map((item, index) => (
                        <li key={index}>{item.name} ({item.quantity})</li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col gap-3 pt-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700"><FaSyncAlt /> Status:</div>
                    <span className={`capitalize font-bold ${getStatusColor(selectedStatus)}`}>{selectedStatus}</span>
                </div>
                
                <select value={selectedStatus} onChange={handleStatusChange} disabled={status === 'Canceled' || status === 'Delivered'}
                    className="w-full p-3 text-sm border border-gray-300 rounded-4xl outline-none focus:border-blue-500 hover:bg-gray-200"
                >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                </select>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex justify-center">
                    <button onClick={handleSaveStatus} disabled={status === 'Canceled' || status === 'Delivered' || isSaving}
                        className="relative overflow-hidden bg-black text-white w-[100%] py-3 rounded-4xl font-semibold shadow-lg group mt-4 disabled:cursor-not-allowed cursor-pointer transition-colors duration-300 hover:bg-gray-900"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isSaving ? 'Saving...' : 'Save Status'} <BsArrowRightCircleFill className="text-xl" />
                        </span>
                        <span className="absolute top-0 left-0 w-10 h-full bg-white/20 -skew-x-12 transform -translate-x-full group-hover:translate-x-[840%] transition-all duration-700 ease-out"></span>
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default OrderCardAdmin;