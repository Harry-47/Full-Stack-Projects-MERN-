import { motion } from "framer-motion";
import { FaTag, FaDollarSign, FaBarcode, FaFolder, FaPercentage, FaImage, FaFont, FaStar } from "react-icons/fa";
import { categories } from "../utils/DetailHelpers";
import InputField from "./InputField";

const RenderAdminDetails = ({ formData, previewImage, onChange, onSubmit, isSaving }) => (
    <div className="min-h-screen p-8 flex flex-col justify-center items-center bg-gradient-to-br from-yellow-50 to-white poppins-regular">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 md:p-12 rounded-4xl shadow-xl max-w-4xl w-full">
            <h1 className="text-4xl font-bold text-center mb-16 flex items-center justify-center gap-4">
                <FaFont /> Edit Product
            </h1>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                <div className="space-y-2">
                    <div className="mb-10 relative">
                        <input name="image" type="file" onChange={onChange} accept="image/*" className="w-full p-4 bg-transparent border-b-2 border-gray-600 focus:outline-none" />
                        <label className="absolute left-0 -top-8 text-gray-500"><FaImage className="inline-block mr-2" />Product Image</label>
                        {previewImage && <img src={previewImage} alt="Preview" className="w-40 h-40 rounded-lg object-contain mt-4 mx-auto" />}
                    </div>
                    <InputField name="title" type="text" placeholder="Title" icon={<FaFont />} value={formData.title} onChange={onChange} required />
                    <InputField name="description" type="text" placeholder="Description" icon={<FaTag />} value={formData.description} onChange={onChange} isTextarea required />
                </div>
                <div className="space-y-2">
                    <InputField name="price" type="number" placeholder="Price" icon={<FaDollarSign />} value={formData.price} onChange={onChange} required />
                    <InputField name="brand" type="text" placeholder="Brand" icon={<FaBarcode />} value={formData.brand} onChange={onChange} required />
                    <div className="mb-8 relative">
                        <select name="category" value={formData.category} onChange={onChange} className="w-full p-4 bg-transparent border-b-2 border-gray-600 focus:outline-none peer">
                            <option value="" disabled>Select Category</option>
                            {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                        </select>
                        <label className="absolute left-0 -top-1 text-xs text-black"><FaFolder className="inline-block mr-2" />Category</label>
                    </div>
                    <InputField name="discount" type="number" placeholder="Discount %" icon={<FaPercentage />} value={formData.discount} onChange={onChange} />
                    <InputField name="rating" type="number" placeholder="Rating" icon={<FaStar />} value={formData.rating} onChange={onChange} step="0.1" min="0" max="5" />
                </div>
                <div className="md:col-span-2 flex flex-col items-center gap-6 mt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input name="onSale" type="checkbox" onChange={onChange} checked={formData.onSale} /> 
                        <span className="text-xl">On Sale?</span>
                    </label>
                    <motion.button type="submit" disabled={isSaving} whileTap={{ scale: 0.97 }} className={`w-full lg:w-1/2 py-4 rounded-4xl text-white font-bold shadow-lg ${isSaving ? 'bg-gray-400' : 'bg-black'}`}>
                        {isSaving ? "Saving..." : "Save Product"}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    </div>
);

export default RenderAdminDetails;