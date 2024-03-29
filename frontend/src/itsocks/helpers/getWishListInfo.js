import { fetchWithoutToken } from "../../utils/api";

export const getDepartamentos = async( ) => {
        
        const resp = await fetchWithoutToken(`shippings/shippings_departamentos?skip=0&limit=10000`)
        const data = await resp.json();
        
        return data
}

export const getWishList = async( id_list ) => {
        
        const resp = await fetchWithoutToken(`wish_list/get_wish_list_by_id_list/${id_list}`)
        const data = await resp.json();

        return data
}

export const setWishList = async( wish_list ) => {
        
        const resp = await fetchWithoutToken(
            `wish_list`,
            wish_list,
            'POST',
        )
        const data = await resp.json();

        return data
}