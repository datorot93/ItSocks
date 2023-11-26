import { fetchWithoutToken } from "../../utils/api";

export const getPacks = async( category ) => {
    
    const resp = await fetchWithoutToken(`packspacks?skip=0&limit=100`)
    const data = await resp.json();

    // console.log('ESTOS SON LOS PACKS');
    // console.log(data);
    return data
}