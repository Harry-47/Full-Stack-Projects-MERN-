import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import fetchFn from "../utils/fetchFn";

const useFetchProducts = () => {
  const { data: rawProducts, isLoading, isError, status } = useQuery(fetchFn);

  const data = useMemo(() => {
    if (!rawProducts) return [];
    const grouped = {};
    rawProducts.forEach((p) => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
    return Object.entries(grouped)
      .slice(0, 5)
      .map(([category, products]) => ({
        category,
        products: products.slice(0, 12),
      }));
  }, [rawProducts]);

  return { data, isLoading, isError, status };
};

export default useFetchProducts;
