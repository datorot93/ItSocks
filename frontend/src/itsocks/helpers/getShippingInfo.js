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

export const getCategoryDiscount = async( categories ) => {
        const query = new URLSearchParams();
        categories.forEach( category => query.append('categories', category) )

        const resp = await fetchWithoutToken(`products/category_discount?${query.toString()}`)
        const data = await resp.json();

        // console.log(data)
        return data
}

export const getSubcategoryDiscount = async( categories ) => {
        const query = new URLSearchParams();
        categories.forEach( subcategory => query.append('subcategories', subcategory) )

        const resp = await fetchWithoutToken(`products/subcategory_discount?${query.toString()}`)
        const data = await resp.json();

        // console.log(data)
        return data
}

export const getTypeDiscount = async ( types ) => {
        const query = new URLSearchParams();
        types.forEach( type => query.append('types', type) )

        const resp = await fetchWithoutToken(`products/type_discount?${query.toString()}`)
        const data = await resp.json();

        // console.log(data)
        return data
}

export const getDesignDiscount = async ( designs ) => {
        const query = new URLSearchParams();
        designs.forEach( design => query.append('designs', design) )

        const resp = await fetchWithoutToken(`products/design_discount?${query.toString()}`)
        const data = await resp.json();

        // console.log(data)
        return data
}



