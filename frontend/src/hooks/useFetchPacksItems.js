import { useEffect, useState } from "react";
import { 
    getProductsByCatType, 
    getProductsByCatTypeDesign,
    getProductsByCatTypeDesignCompresion,
} from '../itsocks/helpers/getProductsByCategory';

export const useFetchPackItems = (skip_page, setSkip, location, categoria, type) => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const locationParts = location.split("/");
    const design = locationParts[3] ? locationParts[3].replace('%20', ' ').toLowerCase() : null;

    const setProductData = async (productPromise) => {
        setLoading(true);
        const res = await productPromise;
        setProducts(products => [...products, ...res]);
        setLoading(false);
    };

    useEffect(() => {
        if(locationParts.length === 3){
            setProductData(getProductsByCatType(categoria, type, skip_page));
        } else if (locationParts.length === 4){
            setProductData(getProductsByCatTypeDesign(categoria, type, design, skip_page));
        } else if (locationParts.length === 5){
            setProductData(
                getProductsByCatTypeDesignCompresion(
                    categoria, 
                    type,
                    design,
                    locationParts[4],
                    skip_page
                )
            );
        }
    }, [skip_page, location]);

    useEffect(() => {
        setProducts([]);
        setSkip(0);
    }, [location]);

    return {products, loading};
};