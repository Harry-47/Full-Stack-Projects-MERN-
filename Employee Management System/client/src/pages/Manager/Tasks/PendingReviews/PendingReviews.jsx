import usePendingReviews from "./hooks/usePendingReviews";
import RenderPendingReviews from "./components/RenderPendingReviews";
import HandleStates from "../../../../components/HandleStates";

const PendingReviews = () => {
  const { tasks, isLoading, isError, updateStatus } = usePendingReviews();

  if (isLoading || isError) return <HandleStates isLoading={isLoading} isError={isError} />;

  return <RenderPendingReviews tasks={tasks} updateStatus={updateStatus} />;
};

export default PendingReviews;