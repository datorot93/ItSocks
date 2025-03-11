import { fetchWithoutToken } from "../../utils/api";


export const getContactInfo = async( ) => {

    const resp = await fetchWithoutToken(
        `contact_info?skip=0&limit=100`
    )
    // const resp = await fetchWithoutToken(
    //     `sliders/active?skip=0&limit=100`
    // )
    const data = await resp.json();

    return data
}
