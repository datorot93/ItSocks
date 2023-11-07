import { fetchWithoutToken } from "../../utils/api";

export const getPacks = async( category ) => {
    
    const resp = await fetchWithoutToken(`packspacks?skip=0&limit=100`)
    const data = await resp.json();

    return data
}