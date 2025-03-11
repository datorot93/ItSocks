import { fetchWithoutToken } from "../../utils/api";


export const getSeasonProducts = async(skip) => {
    
    const resp = await fetchWithoutToken(
        `products/temporada?skip=${0}&limit=100`
    )
    const data = await resp.json();
    console.log(data)
    return data
}