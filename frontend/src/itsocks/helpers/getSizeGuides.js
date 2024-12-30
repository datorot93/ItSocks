import { fetchWithoutToken } from "../../utils/api";

export const getSizeGuidByName = async( size_guide ) => {

    const resp = await fetchWithoutToken(`size_guides/${size_guide}`)
    const data = await resp.json();

    return data
}


export const getSizeGuides = async () => {
    const resp = await fetchWithoutToken(`size_guides`)
    const data = await resp.json();

    return data
}