const decideMessage = (status) => {

    switch (status) {
        case 404:
            return "Data Not Found";
        case 500:
            return "Server Error. Please try again later.";
        case 401:
            return "Unauthorized. Please login again.";
        case 403:
            return "Forbidden. You don't have permission to access this resource.";
        case 429:
            return "Too many requests. Please slow down.";
        default:
            return "An unexpected error occurred. Please try again.";
    }
}
export default decideMessage;