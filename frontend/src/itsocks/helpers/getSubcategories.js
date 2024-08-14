import { fetchWithoutToken } from "../../utils/api";


export const getSubcategories = async( ) => {

    const resp = await fetchWithoutToken(
        `subcategories?skip=0&limit=100`
    )
    // const resp = await fetchWithoutToken(
    //     `sliders/active?skip=0&limit=100`
    // )
    const data = await resp.json();

    return data
}


export const getTypes = async( ) => {

    const resp = await fetchWithoutToken(
        `type_images?skip=0&limit=100`
    )
    // const resp = await fetchWithoutToken(
    //     `sliders/active?skip=0&limit=100`
    // )
    const data = await resp.json();

    return data
}