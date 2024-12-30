import { fetchWithoutToken } from "../../utils/api";

export const getSliders = async( ) => {

    const resp = await fetchWithoutToken(`sliders/active?skip=0&limit=100`)
    const data = await resp.json();

    return data
}

export const getLifeStyles = async( ) => {

    const resp = await fetchWithoutToken(
        `tags?skip=0&limit=100`
    )
    // const resp = await fetchWithoutToken(
    //     `sliders/active?skip=0&limit=100`
    // )
    const data = await resp.json();

    return data
}