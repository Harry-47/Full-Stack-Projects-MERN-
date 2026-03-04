import {toast} from 'react-toastify';

const loaderProfile =  async ({params}) => {

    const id = params.id;

    try
    {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile/${id}`,
        {
            credentials: 'include'
        })

        if(!response.ok)
            toast.error(`Error Loading User's Profile!`)


        const data = await response.json();
        return data;
        
    }
    catch(error)  
    {
      toast.error("Failed to load profile.")
      console.log(error)
    }
}
export default loaderProfile;