import { fetchWithoutToken } from "../../utils/api";

export const getProductsByCategory = async( category ) => {
    
    const resp = await fetchWithoutToken(`products/accesorios?category=${category}&skip=0&limit=2000`)
    const data = await resp.json();

    return data
}

export const getProductExtraInfo = async( name ) => {
    const resp = await fetchWithoutToken(`products/q/colors_tallas/${name}`)
    const data = await resp.json();
 
    return data
}