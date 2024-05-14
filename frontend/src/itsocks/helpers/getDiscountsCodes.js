import { fetchWithoutToken } from "../../utils/api";

export const getDiscountCode = async( code ) => {
        
        const resp = await fetchWithoutToken(`discountsspecific_code?code=${code}`)
        const data = await resp.json();
        
        return data
}

const promo = 10

export const postUniqueDiscountCode = async( email, name) => {

        const resp = await fetchWithoutToken(`/discounts/unique_discount_code_create`, { email, name, promo }, 'POST')

        console.log(resp)
        const data = await resp.json();

        return data
}