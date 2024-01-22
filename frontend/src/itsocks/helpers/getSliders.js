import { fetchWithoutToken } from "../../utils/api";

export const getSliders = async( ) => {

    const resp = await fetchWithoutToken(`sliders/sliders?skip=0&limit=100`)
    const data = await resp.json();

    return data
}