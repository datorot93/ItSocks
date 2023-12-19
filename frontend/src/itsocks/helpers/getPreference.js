import { fetchWithoutToken } from "../../utils/api";

export const getPreference = async( datos_compra ) => {
    // http://localhost:8000/api/v1/payments_preferencecreate_payment_preference
    const resp = await fetchWithoutToken(
        `/payments_preferencecreate_payment_preference`, JSON.stringify(datos_compra), 
        'POST'
    );

    const data = await resp.json();
        
    return data;
}