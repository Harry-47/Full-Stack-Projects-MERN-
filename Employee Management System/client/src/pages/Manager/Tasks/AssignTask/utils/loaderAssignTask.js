import {queryClient} from "../../../../../utils/queryClient"
import decideEndpoint from "./decideEndpoint"

const loaderAssignTask = async() => {
    const fetchFn = decideEndpoint("Development")
    await queryClient.ensureQueryData(fetchFn)
}

export default loaderAssignTask;