import { motion } from 'framer-motion';


const ShippingForm = ({ onSubmit, isSubmitting }) => {
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const customerDetails = {
            name: formData.get('name'),
            address: formData.get('address'),
            phone: formData.get('phone'),
        };

        onSubmit(customerDetails);
    };

    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white p-8 rounded-4xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Shipping Details</h2>
            
            {/* Standard HTML Form with onSubmit */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                    <input type="text" name="name" required className="w-full p-3 rounded-4xl border border-gray-300 focus:ring-2 focus:ring-black" placeholder="Must be at least 3 characters!" minLength={3}/>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Address</label>
                    <input type="text" name="address" required className="w-full p-3 rounded-4xl border border-gray-300 focus:ring-2 focus:ring-black"  placeholder='Must be at least 10 characters' minLength={10}/>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <input type="tel" name="phone" required className="w-full p-3 rounded-4xl border border-gray-300 focus:ring-2 focus:ring-black" placeholder="Must be 11 digits!" minLength={11} maxLength={11}/>
                </div>
                
                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-4xl text-white font-bold shadow-lg bg-black disabled:opacity-50 flex items-center justify-center cursor-pointer"
                >
                    {isSubmitting ? 'Processing...' : 'Complete Order'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default ShippingForm;