import { fetchWithoutToken } from "../../utils/api";

export const getDepartamentos = async( ) => {
        
        const resp = await fetchWithoutToken(`shippings/shippings_departamentos?skip=0&limit=10000`)
        const data = await resp.json();
        
        return data
}

export const getCiudadesPorDepartamento = async( departamento ) => {
        
        const resp = await fetchWithoutToken(`shippings/municipiios_by_departamento?departamento=${departamento}&skip=0&limit=10000`)
        const data = await resp.json();

        return data
}

export const getShippingCost = async( departamento, ciudad ) => {
        
        const resp = await fetchWithoutToken(`shippings/shipping_cost?departamento=${departamento}&municipio=${ciudad}&skip=0&limit=10000`)
        const data = await resp.json();

        return data
}