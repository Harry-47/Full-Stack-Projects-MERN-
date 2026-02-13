import { FaSearch, FaTimes } from "react-icons/fa";

const EmployeeSearch = ({ search, setSearch, onSearch, onClear, hasResults }) => {
  return (
    <form onSubmit={onSearch} className="w-full md:w-96 relative">
      <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer">
        <FaSearch />
      </button>
      <input
        type="text"
        placeholder="Search and press Enter..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-12 pr-12 py-3 rounded-full bg-white border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none shadow-sm transition-all"
      />
      {hasResults && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer"
        >
          <FaTimes />
        </button>
      )}
    </form>
  );
};

export default EmployeeSearch;