import { fetchWithoutToken } from "../../utils/api";

export const getPacks = async( ) => {
    
    const resp = await fetchWithoutToken(`packs?skip=0&limit=100`)
    const data = await resp.json();

    // console.log('ESTOS SON LOS PACKS');
    // console.log(data);
    return data
}