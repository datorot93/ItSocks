import { fetchWithoutToken } from "../../utils/api";

export const getProductsByCategory = async( category ) => {
    
    const resp = await fetchWithoutToken(`products/accesorios?category=${category}&skip=0&limit=100`)
    const data = await resp.json();

    return data
}