import { useState } from "react";
import useProfile from "./hooks/useProfile";
import FormInput from "../../components/FormInput";
import Header from "../../components/Header";
import HandleStates from "../../components/HandleStates";
import { FaCamera, FaSave, FaUserEdit } from "react-icons/fa";

const ProfilePage = () => {
  const { user, isLoading, isError, updateProfile, isUpdating } = useProfile();
  const [isEdit, setIsEdit] = useState(false);
  
  // detect role 
  const role = localStorage.getItem("role")

  if (isLoading || isError) return <HandleStates isLoading={isLoading} isError={isError} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // passing role to mutation
    updateProfile({ formData, role: role });
    setIsEdit(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-6 lg:p-12 poppins-regular">
      <Header title="MY PROFILE" subtitle={`Manage your ${role} identity`} />

      <div className="max-w-4xl mx-auto mt-10">
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="h-32 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
          
          <div className="px-10 pb-10 -mt-16">
            <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
              <div className="relative group">
                <img 
                  src={user? import.meta.env.VITE_API_URL + `/${user.profilePic}` : "https://via.placeholder.com/150"} 
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg" 
                  
                />
                {isEdit && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all">
                    <FaCamera className="text-white text-xl" />
                    <input type="file" name="profilePic" className="hidden" accept="image/*" />
                  </label>
                )}
              </div>

              <div className="flex-1 pb-2">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{user?.name}</h2>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">
                   {user?.role} — {user?.category || "Core Team"}
                </p>
              </div>

              <button 
                type="button"
                onClick={() => setIsEdit(!isEdit)}
                className="mb-2 px-6 py-2 bg-gray-100 text-gray-600 rounded-full font-bold text-xs flex items-center gap-2"
              >
                {isEdit ? "Cancel" : <><FaUserEdit /> Edit Profile</>}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              {/* Note: value={user?.name} default is given, if isEdit is enabled then input will be taken */}
              <FormInput label="Full Name" name="name" value={isEdit ? undefined : user?.name} placeholder={user?.name} required={isEdit} />
              <FormInput label="Email Address" name="email" value={user?.email} placeholder={user?.email} required={false} />
              <FormInput label="Phone Number" name="number" value={isEdit ? undefined : user?.number} placeholder={user?.number || "Add Number"} />
              <FormInput label="Account ID" value={user?._id?.slice(-8).toUpperCase()} placeholder="System ID" />
            </div>

            <div className="mt-2">
              <FormInput 
                label="Bio / Summary" 
                name="bio" 
                isTextArea 
                value={isEdit ? undefined : user?.bio} 
                placeholder={user?.bio || "Describe yourself..."} 
              />
            </div>

            {isEdit && (
              <button 
                type="submit" 
                disabled={isUpdating}
                className="w-full mt-6 py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <FaSave /> {isUpdating ? "Saving..." : "Update Profile"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;