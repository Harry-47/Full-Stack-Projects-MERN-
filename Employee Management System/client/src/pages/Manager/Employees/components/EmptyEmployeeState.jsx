import { FaUserTie } from "react-icons/fa";

const EmptyEmployeeState = ({ search, onShowAll, isSearchResult }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <div className="bg-white p-6 rounded-full shadow-sm mb-4">
        <FaUserTie size={40} className="opacity-20" />
      </div>
      <p className="text-lg font-medium">No employees found {search ? `matching "${search}"` : ""}.</p>
      {isSearchResult && (
        <button onClick={onShowAll} className="text-blue-600 mt-2 font-bold cursor-pointer hover:underline">
          Show All Employees
        </button>
      )}
    </div>
  );
};

export default EmptyEmployeeState;