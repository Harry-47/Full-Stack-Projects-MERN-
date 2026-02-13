import { motion } from "framer-motion";

const InputField = ({ name, type, placeholder, icon, value, onChange, isTextarea, ...rest }) => {
    const hasValue = value?.toString().length > 0;
    const Component = isTextarea ? "textarea" : "input";

    return (
        <div className="mb-8 relative group">
            <Component
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder=" "
                className={`w-full p-4 bg-transparent border-b-2 border-gray-600 text-black focus:outline-none peer resize-none ${isTextarea ? 'h-32' : ''}`}
                {...rest}
            />
            <motion.label
                animate={hasValue ? { y: -20, fontSize: "0.75rem" } : {}}
                className="absolute left-0 top-4 text-gray-500 pointer-events-none transition-all duration-300 peer-focus:-top-1 peer-focus:text-xs peer-focus:text-black"
            >
                {icon && <span className="inline-block mr-2 align-middle">{icon}</span>}
                {placeholder}
            </motion.label>
            <motion.div className="absolute bottom-0 left-0 h-0.5 bg-black" animate={{ width: hasValue ? "100%" : "0%" }} />
        </div>
    );
};

export default InputField;