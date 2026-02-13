import {queryClient }from "../../../../utils/queryClient"
import decideEndpoint from "../utils/decideEndpoint"

const employeeDashboardLoader = async ({params})=> {

    const {id} = params
    const fetchFn = decideEndpoint(id)
 
    await queryClient.ensureQueryData(fetchFn)

}

export default employeeDashboardLoader;