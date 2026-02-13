import { useState } from "react";
import axiosApi from "../../../../utils/axiosInstance";
import Header from "../../../../components/Header";
import HandleStates from "../../../../components/HandleStates";
import EmployeeSearch from "./EmployeeSearch";
import EmployeeGrid from "./EmployeeGrid";
import EmptyEmployeeState from "./EmptyEmployeeState";

const RenderEmployees = ({ employees, deleteEmployee }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const { data } = await axiosApi.get(`/manager/employees?search=${search}`);
      setSearchResults(data.data || []);
    } catch (err) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearch("");
    setSearchResults(null);
  };

  const displayData = searchResults !== null ? searchResults : employees;

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 p-6 lg:p-12 font-sans poppins-regular">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search Bar Row */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div className="w-full text-left">
            <Header title="TEAM" subtitle="Manage Your Employees" />
          </div>
          
          
        </div>
        <center className="-mt-10 mb-6">
          <EmployeeSearch 
            search={search} 
            setSearch={setSearch} 
            onSearch={handleSearch} 
            onClear={handleClear}
            hasResults={searchResults !== null}
          />
        </center>
        

        {/* Dynamic Content Rendering */}
        {isSearching ? (
          <HandleStates isLoading={true} />
        ) : displayData?.length > 0 ? (
          <EmployeeGrid displayData={displayData} deleteEmployee={deleteEmployee} />
        ) : (
          <EmptyEmployeeState 
            search={search} 
            onShowAll={handleClear} 
            isSearchResult={searchResults !== null} 
          />
        )}
      </div>
    </div>
  );
};

export default RenderEmployees;