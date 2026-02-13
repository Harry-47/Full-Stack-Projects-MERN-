import useFetchProducts from "../ProductListing/hooks/useFetchProducts";
import RenderProducts from "./components/RenderProducts";
import HandleStates from "../../../components/HandleStates";

const ProductListing = () => {

  const { data, isLoading, isError, status } = useFetchProducts();

 if (isLoading || isError) {
    return <HandleStates isLoading={isLoading} isError={isError} status={status} />;
  }

  return <RenderProducts data={data} />;
  
};

export default ProductListing;
