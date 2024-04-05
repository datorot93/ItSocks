import { fetchWithoutToken } from "../../utils/api";

export const getDiscountCode = async( code ) => {
        
        const resp = await fetchWithoutToken(`discountsspecific_code?code=${code}`)
        const data = await resp.json();
        
        return data
}