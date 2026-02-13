import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaSearch, FaTrashAlt } from "react-icons/fa";
import Navbar from "../../../../components/SearchBar";

const RenderUsers = ({ users, query, setQuery, onSearch, onDelete, isDeleting }) => {
    return (
        <>
            <Navbar page={"admin-user"} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-screen bg-gray-100 p-8 poppins-regular"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-black via-gray-500 to-blue-500 bg-clip-text text-transparent">
                        <FaUser className="inline-block mr-3" /> All Users
                    </h1>
                    <p className="text-gray-600 mt-2">Manage all registered users.</p>
                </div>

                <div className="flex justify-center mb-6">
                    <form onSubmit={onSearch} className="flex items-center gap-2 p-2 bg-gray-200 rounded-4xl w-full max-w-lg">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-200 rounded-4xl outline-none"
                        />
                        <button type="submit" className="p-3 bg-black rounded-4xl text-white hover:bg-gray-800 cursor-pointer transition-all">
                            <FaSearch />
                        </button>
                    </form>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <AnimatePresence>
                                {users.map((user) => (
                                    <motion.tr key={user._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.name || user.displayName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{user.role}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <button
                                                onClick={() => onDelete(user.email)}
                                                disabled={isDeleting}
                                                className="text-red-600 hover:text-red-900 cursor-pointer transition-colors"
                                            >
                                                {isDeleting ? '...' : <FaTrashAlt />}
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </>
    );
};

export default RenderUsers;