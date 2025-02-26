import { useEffect, useState } from "react";

import { getSeasonProducts } from "../itsocks/helpers/getSeasonProducts";

export const useFetchSeasonItems = ({ skip_page, setSkip, location}) => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);


    const setProductData = async (productPromise) => {
        setLoading(true);
        const res = await productPromise;
        setProducts(products => [...products, ...res]);
        setLoading(false);
    };

    useEffect(() => {
        
        setProductData(
            getSeasonProducts(skip_page)
        );
        
    }, [skip_page, location]);

    // useEffect(() => {
    //     setProducts([]);
    //     setSkip(0);
    // }, [location]);

    return {products, loading};
};