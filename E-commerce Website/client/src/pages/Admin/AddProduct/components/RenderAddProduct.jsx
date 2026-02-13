import { motion } from "framer-motion";
import { FaTag, FaDollarSign, FaBarcode, FaPalette, FaFolder, FaStar, FaPercentage, FaImage, FaFont, FaPlusCircle } from "react-icons/fa";
import { CATEGORIES } from "../utils/addProductHelpers";
import InputField from "./InputFields";
import SelectField from "./SelectField";

const RenderAddProduct = ({ formData, previewImage, handleChange, handleSubmit, uploadProgress, isProcessing, isPending }) => {
    return (
        <div className="min-h-screen p-8 text-black flex flex-col justify-center items-center poppins-regular bg-gradient-to-br from-yellow-50 to-white">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="bg-white p-8 md:p-12 rounded-4xl shadow-xl max-w-4xl w-full">
                
                <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-4">
                    <FaPlusCircle className="text-4xl" /> Add New Product
                </h1>
                
                <form onSubmit={handleSubmit} className="grid gap-6 mt-20" encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <div className="space-y-4">
                            {/* Image Upload Area */}
                            <div className="mb-8 relative group">
                                <input name="image" type="file" onChange={handleChange} required className="w-full p-4 bg-transparent border-b-2 border-gray-600 text-black focus:outline-none" />
                                <label className="absolute left-0 top-[-2rem] text-gray-500"><FaImage className="inline-block mr-2 align-middle" /> Product Image</label>
                                {previewImage && <img src={previewImage} alt="Preview" className="mt-4 w-full h-40 object-contain rounded-lg" />}
                            </div>

                            <InputField name="title" type="text" placeholder="Product Title" icon={<FaFont />} value={formData.title} onChange={handleChange} required />
                            <InputField name="description" type="text" placeholder="Description" icon={<FaTag />} value={formData.description} onChange={handleChange} isTextarea required />
                            <InputField name="price" type="number" placeholder="Price" icon={<FaDollarSign />} value={formData.price} onChange={handleChange} required />
                            <InputField name="brand" type="text" placeholder="Brand" icon={<FaBarcode />} value={formData.brand} onChange={handleChange} required />
                        </div>
                        
                        <div className="space-y-4">
                            <InputField name="model" type="text" placeholder="Model" icon={<FaBarcode />} value={formData.model} onChange={handleChange} />
                            <InputField name="color" type="text" placeholder="Color" icon={<FaPalette />} value={formData.color} onChange={handleChange} />
                            <SelectField name="category" placeholder="Category" icon={<FaFolder />} options={CATEGORIES} value={formData.category} onChange={handleChange} required />
                            <InputField name="discount" type="number" placeholder="Discount %" icon={<FaPercentage />} value={formData.discount} onChange={handleChange} min={0} max={100} />
                            <InputField name="rating" type="number" placeholder="Rating" icon={<FaStar />} value={formData.rating} onChange={handleChange} step="0.1" min={0} max={5} />
                            <InputField name="stock" type="number" placeholder="Stock Quantity" icon={<FaBarcode />} value={formData.stock} onChange={handleChange} required min={0} />
                        </div>
                    </div>

                    <div className="flex justify-center items-center my-6">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                            <input name="onSale" type="checkbox" onChange={handleChange} checked={formData.onSale} />
                            <span className="text-xl font-medium">On Sale?</span>
                        </label>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <motion.button type="submit" disabled={isPending} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            className={`w-full lg:w-1/2 mt-6 px-6 py-4 rounded-4xl text-white font-bold shadow-lg relative overflow-hidden transition-all duration-300 ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}>
                            <span className="relative z-10">{isPending ? "Processing..." : "Add Product"}</span>
                        </motion.button>

                        {/* Progress Bar UI */}
                        {uploadProgress > 0 && (
                            <div className="w-full lg:w-1/2 bg-gray-200 rounded-full h-4 mt-4 mb-2 overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        )}

                        <div className="text-center text-sm font-bold mt-2">
                            {uploadProgress > 0 && uploadProgress < 100 && `Uploading: ${uploadProgress}%`}
                            {isProcessing && <span className="text-green-600 animate-pulse">Finalizing & Saving to Cloud... ☁️</span>}
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RenderAddProduct;