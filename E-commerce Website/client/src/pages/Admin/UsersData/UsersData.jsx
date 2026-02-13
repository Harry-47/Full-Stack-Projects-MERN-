import { useState } from "react";
import { useUsers, useDeleteUser } from "./hooks/useAdminUsers";
import RenderUsers from "./components/RenderUsers";
import LoadingSpinner from "../../../components/LoadingSpinner";
import HandleStates from "../../../components/HandleStates";

const UserData = () => {
    const [query, setQuery] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");

    // 1. Logic Hooks
    const { data: users, isLoading, isError, status } = useUsers(appliedSearch);
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

    // 2. Handlers
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setAppliedSearch(query);
    };

    const handleDelete = (email) => {
        if (window.confirm(`Delete user ${email}?`)) {
            deleteUser(email);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <HandleStates isError={isError} status={status} />;

    return (
        <RenderUsers 
            users={users || []}
            query={query}
            setQuery={setQuery}
            onSearch={handleSearchSubmit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
        />
    );
};

export default UserData;