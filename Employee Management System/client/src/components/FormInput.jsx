const FormInput = ({
  label,
  type = "text",
  name,
  placeholder,
  options = [],
  isTextArea = false,
  required = false,
  multiple,
  value
}) => {
  const baseClass =
    "w-full p-3 bg-white/5 border border-white/10 rounded-xl text-black focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all duration-300 mb-4";

  return (
    <div className="w-full">
      {label && (
        <label className="text-xs uppercase tracking-widest text-cyan-400/70 mb-1 block ml-1">
          {label}
        </label>
      )}

      {/*Determining which input type to render*/}
      {isTextArea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          required={required}
          className={`${baseClass} h-32`}
          value={value}
        />
      ) : type === "select" ? (
        <select name={name} required={required} className={baseClass} value={value}>
          <option value={value} className={baseClass}>
            {placeholder || "Select Option"}
          </option>
          {options.map((opt) => (
            <option key={opt._id} value={opt._id} className={baseClass}>
              {opt.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          className={baseClass}
          value={value}
          accept={type === "file" ? ".pdf,image/*" : undefined}
          multiple={multiple}
        />
      )}
    </div>
  );
};

export default FormInput;
