import decideMessage from "../utils/decideMessage";
import ErrorDisplay from "./ErrorDisplay";
import LoadingSpinner from "./LoadingSpinner";


const HandleStates = (isLoading, isError, status) => {
  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorDisplay 
          message={`${decideMessage(status)}`}  
        />
      </div>
    );
  }
};

export default HandleStates;

