import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const SelectField = ({ name, placeholder, icon, options, value, onChange, required }) => {
    const hasValue = value && value.toString().length > 0;

    return (
        <div className="mb-8 relative group">
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full p-4 bg-transparent border-b-2 border-gray-600 text-black focus:outline-none peer appearance-none cursor-pointer"
            >
                <option value="" disabled className="text-gray-400">Select Category</option>
                {options.map((option) => (
                    <option key={option} value={option} className="text-black">{option}</option>
                ))}
            </select>
            
            <motion.label
                initial={{ y: -20, fontSize: "0.75rem" }} // Always floating for select
                className="absolute left-0 top-4 text-gray-500 pointer-events-none"
            >
                {icon && <span className="inline-block mr-2 align-middle">{icon}</span>}
                {placeholder}
            </motion.label>
            
            <div className="absolute right-4 top-5 pointer-events-none text-gray-500"><FaChevronDown size={14} /></div>
            <motion.div className="absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-500 peer-focus:w-full" animate={{ width: hasValue ? "100%" : "0%" }} />
        </div>
    );
};

export default SelectField;