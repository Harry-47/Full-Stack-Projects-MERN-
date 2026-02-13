import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import OrderCardAdmin from "../../../../components/OrderCardAdmin"; 

const OrdersGrid = ({ orders, query, setQuery, onSearch }) => {
    return (
        <>
            {/* Search Bar */}
            <div className="flex justify-center mb-6">
                <form onSubmit={onSearch} className="flex items-center gap-2 p-2 bg-gray-200 rounded-4xl w-full max-w-lg">
                    <input
                        type="text"
                        placeholder="Search by name or address..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-200 rounded-4xl outline-none placeholder-gray-500"
                    />
                    <motion.button type="submit" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-3 bg-black rounded-4xl text-white">
                        <FaSearch />
                    </motion.button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <OrderCardAdmin
                            key={order._id} 
                            orderId={order._id}
                            userId={order.userId}
                            items={order.items}
                            totalPrice={order.totalPrice}
                            status={order.status}
                            name={order.name}
                            address={order.address}
                            phone={order.phone}
                            isVerified={order.isVerified}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center p-10 text-gray-500 text-xl">
                        <p>No orders found.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default OrdersGrid;