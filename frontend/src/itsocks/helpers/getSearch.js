import { fetchWithoutToken } from "../../utils/api";


const LIMIT_QUERY = 15;
export const getSearchedProudcts = async( input, skip ) => {
        
    const resp = await fetchWithoutToken(`products/q/search?input=${input}&skip=${skip}&limit=${LIMIT_QUERY}`)
    const data = await resp.json();
    
    return data
}