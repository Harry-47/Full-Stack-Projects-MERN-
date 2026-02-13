import {queryClient} from '../../../../main'; 
import decideURL from "./decideURL"

const productListingCategoryLoader = async ({ request, params }) => {

  //decide api endpoint to hit based upon the query parameters and required category OR the searchTerm and query parameters
  //because this single page is handling both of these functionalities
    const {filters, category, fetchFn} = decideURL(request, params)

  // ⭐ Prefetch with FULL key (including filters!)
  await queryClient.prefetchQuery(fetchFn);

  return { filters, category };
};

export default productListingCategoryLoader;