import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { 
  getProductsByCatSubcatType, 
  getProductsByCategory, 
  getProductsByCatSubcatTypeDesign,
  getProductsByCategoryDesign,
  getProductsByCatSubcatTypeDesignCompresion
} from '../itsocks/helpers/getProductsByCategory';

export const useFetchItems = (skip_page, setSkip, location, design, categoria, subcategoria, type) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const locationParts = location.split("/");

  // console.log('ENTRÉ AL USEFETCHITEMS')
  // console.log(categoria, subcategoria, type)

  const setProductData = async (productPromise) => {
    setLoading(true);
    const res = await productPromise;
    setProducts(products => [...products, ...res]);
    setLoading(false);
  };

  useEffect(() => {
    // console.log('ENTRÉ AL USEEFFECT')
    if(categoria && subcategoria && type){
      if(locationParts.length == 4 && locationParts[1].toLowerCase() !== 'accesorios'){
        setProductData(getProductsByCatSubcatType(categoria, subcategoria, type, skip_page + 3));
      } else if (locationParts.length === 5 && locationParts[1].toLowerCase() !== 'accesorios') {
        setProductData(getProductsByCatSubcatTypeDesign(categoria, subcategoria, type, design.replace('%20', ' '), skip_page + 3));
      } else if (locationParts.length === 6 && ['medias_sin_compresion', 'medias_de_compresion'].includes(locationParts[5])) {
        setProductData(
          getProductsByCatSubcatTypeDesignCompresion(
            categoria, 
            subcategoria,
            type,
            design.replace('%20', ' '),
            locationParts[5],
            skip_page + 3
          )
        );
      }
    } else {
      if(locationParts.length == 2 && locationParts[1].toLowerCase() === 'accesorios'){
        setProductData(getProductsByCategory(categoria, skip_page + 3));
      } else if (locationParts.length === 3 && locationParts[1].toLowerCase() === 'accesorios') {
        const disenio = locationParts[2].replace('%20', ' ').toLowerCase();
        setProductData(getProductsByCategoryDesign(categoria, disenio, skip_page + 3));
      }
    }
  }, [skip_page, location]);

  useEffect(() => {
    setProducts([]);
    setSkip(0);
  }, [location]);

  return {products, loading};
};