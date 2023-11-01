import { fetchWithoutToken } from "../../utils/api";

export const getProductsByCategory = async( category ) => {
    
    const resp = await fetchWithoutToken(`products/accesorios?category=${category}&skip=0&limit=100`)
    // const resp = await fetchWithoutToken('products');
    const data = await resp.json();

    // console.log('ESTA ES LA DATA');
    // console.log(data);
    return data
}